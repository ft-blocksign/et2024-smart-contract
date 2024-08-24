// SPDX-License-Identifier: MIT
pragma solidity <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/PublicResolver.sol";
import "@ensdomains/ens-contracts/contracts/reverseRegistrar/ReverseClaimer.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "./SubdomainUtils.sol";
/*
	> deploy 
	> setRootNode 
	> safeTransferFrom: 0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85 [owner to this addr]
	> mint
*/ 
contract SimpleSignContract is ERC721, ERC2771Context, ReverseClaimer {
	struct s_contract {
		address issuer;
		mapping(address => bool) authorized;
		string encryptedData;
		uint256 expirationTime;
	}

	ENS public ens;
	PublicResolver public resolver;
	bytes32 public rootNode;
	bytes32 public subNode;
	// ENSとResolverを指定
    constructor(
        address ensAddress,
        address resolverAddress,
        address trustedForwarder
    ) 
        ERC721("SSC_NAME", "SSC_SYMBOL") 
        ERC2771Context(trustedForwarder)
		payable ReverseClaimer(ENS(ensAddress), address(this))
    {
        ens = ENS(ensAddress);
        resolver = PublicResolver(resolverAddress);
        rootNode = 0x0;
        originalOwner = msg.sender;
        currentOwner = msg.sender;
    }

	uint256 public gasFund;
	address	public currentOwner;
	address public originalOwner;
	uint256 private _tokenIdCounter = 0;
	mapping(uint256 => s_contract) private _s_contract;
	mapping(address => uint256[]) private _issuerContracts;
	mapping(address => uint256[]) private _authorizedContracts;
	mapping(uint256 => mapping(address => bool)) private _isSigned;

	modifier onlyOwner() {
		require(msg.sender == currentOwner, "Not the owner");
		_;
	}
	modifier onlyCurrentOwner() {
		require(msg.sender == currentOwner, "Not the current owner");
		_;
	}
	modifier onlyOriginalOwner() {
		require(msg.sender == originalOwner, "Not the original owner");
		_;
	}

	// erc2771
    function _msgSender() internal view override(Context, ERC2771Context) returns (address) {
        return super._msgSender();
    }
    function _msgData() internal view override(Context, ERC2771Context) returns (bytes calldata) {
        return super._msgData();
    }
	function _contextSuffixLength() internal view virtual override(Context, ERC2771Context) returns (uint256) {
        return ERC2771Context._contextSuffixLength();
    }

	// 契約書の生成
	// 発行者, 参加者, 暗号化された文面, 有効期限
	function mint(
		address issuer,
		address[] memory authorizedAddresses,
		string memory encryptedData,
		uint256 expirationTime,
		string memory subdomain
	) external returns (uint256) {
		// Ensure a certain amount of ETH is sent to cover gas
        // require(msg.value >= 0.01 ether, "Insufficient ETH sent");
		SubdomainUtils.validateSubdomain(subdomain);

		uint256 tokenId = _tokenIdCounter++;
		_mint(address(this), tokenId);

		s_contract storage contractData = _s_contract[tokenId];
		contractData.issuer = issuer;
		contractData.encryptedData = encryptedData;
		contractData.expirationTime = expirationTime;
		_issuerContracts[issuer].push(tokenId);
		for (uint i = 0; i < authorizedAddresses.length; i++) {
			contractData.authorized[authorizedAddresses[i]] = true;
			_authorizedContracts[authorizedAddresses[i]].push(tokenId);
		}

		require(SubdomainUtils.isSubdomainAvailable(ens, rootNode, subdomain), "Subdomain is not available");
		registerSubdomain(subdomain, tokenId);
		return tokenId;
	}

	function sign2Contract(uint256 tokenId) external {
		require(_exists(tokenId), "Token does not exist");

		s_contract storage contractData = _s_contract[tokenId];
		// require(contractData.authorized[msg.sender], "Not authorized to sign");
		// require(!_isSigned[tokenId][msg.sender], "Already signed");
		require(contractData.authorized[_msgSender()], "Not authorized to sign");
    	require(!_isSigned[tokenId][_msgSender()], "Already signed");

		_isSigned[tokenId][_msgSender()] = true;
	}

	function isAuthorized(uint256 tokenId, address addr) external view returns (bool) {
		s_contract storage contractData = _s_contract[tokenId];
		return contractData.authorized[addr];
	}

	function isSignd(uint256 tokenId, address addr) external view returns (bool) {
		require(_exists(tokenId), "Token does not exist");
		return _isSigned[tokenId][addr];
	}

	/* GETTER FUNCTIONS */ 
	function getIssuerContracts() external view returns (uint256[] memory) {
		return _issuerContracts[msg.sender];
	}
	function getAuthorizedContracts() external view returns (uint256[] memory) {
		return _authorizedContracts[msg.sender];
	}

	function getContractData(uint256 tokenId) external view returns (
		address issuer,
		string memory encryptedData,
		uint256 expirationTime,
		address[] memory authorizedAddresses
	) {
		require(_exists(tokenId), "Query for nonexistent token");

		s_contract storage contractData = _s_contract[tokenId];
		require(msg.sender == contractData.issuer || contractData.authorized[msg.sender], "Not authorized");

		// Gather authorized addresses
		uint256 count = 0;
		for (uint i = 0; i < _authorizedContracts[msg.sender].length; i++) {
			if (_authorizedContracts[msg.sender][i] == tokenId) {
				count++;
			}
		}
		
		address[] memory authorizedList = new address[](count);
		uint256 index = 0;
		for (uint i = 0; i < _authorizedContracts[msg.sender].length; i++) {
			if (_authorizedContracts[msg.sender][i] == tokenId) {
				authorizedList[index] = msg.sender;
				index++;
			}
		}

		return (
			contractData.issuer,
			contractData.encryptedData,
			contractData.expirationTime,
			authorizedList
		);
	}

	// supports
	function _exists(uint256 tokenId) internal view returns (bool) {
		return _tokenIdCounter > tokenId;
	}

	// function onERC721Received(
	// 	address operator,
	// 	address from,
	// 	uint256 tokenId,
	// 	bytes calldata data
	// ) external returns (bytes4) {
	// 	return this.onERC721Received.selector;
	// }

	// ENS Imple
	function setRootNode(string memory domain) external {
        rootNode = keccak256(abi.encodePacked(keccak256("eth"), keccak256(bytes(domain))));
    }

	function getRootNode() external view returns (bytes32) {
		return rootNode;
	}

	function _setSubnodeOwner(bytes32 label, address newOwner) internal {
        require(rootNode != 0x0, "Root node not set");
        ens.setSubnodeOwner(rootNode, label, newOwner);
    }

	function registerSubdomain(string memory subdomain, uint256 tokenId) internal {
        require(bytes(subdomain).length > 0, "Subdomain is required");

        bytes32 label = keccak256(abi.encodePacked(subdomain));
        _setSubnodeOwner(label, address(this));

        bytes32 fullSubdomainHash = keccak256(abi.encodePacked(rootNode, label));
        ens.setSubnodeRecord(rootNode, label, address(this), address(resolver), 0);

        resolver.setAddr(fullSubdomainHash, address(this));
        resolver.setText(fullSubdomainHash, "tokenId", Strings.toString(tokenId));
    }
}
