// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import "@ensdomains/ens-contracts/contracts/resolvers/PublicResolver.sol";

library SubdomainUtils {
	// サブドメインの検証関数
	// サブドメインの長さが適切であることを確認
	// 先頭または末尾がハイフンでないことを確認
	// 使用可能な文字だけを許可する
	function validateSubdomain(string memory subdomain) internal pure {
		bytes memory subdomainBytes = bytes(subdomain);
		require(subdomainBytes.length >= 3 && subdomainBytes.length <= 63, "Subdomain must be between 3 and 63 characters");
		require(subdomainBytes[0] != '-' && subdomainBytes[subdomainBytes.length - 1] != '-', "Subdomain cannot start or end with a hyphen");
		for (uint i = 0; i < subdomainBytes.length; i++) {
			bytes1 char = subdomainBytes[i];
			require(
				(char >= 0x61 && char <= 0x7A) || // 'a' to 'z'
				(char >= 0x30 && char <= 0x39) || // '0' to '9'
				char == 0x2D, // '-'
				"Subdomain contains invalid characters"
			);
		}
	}

	// サブドメインの重複確認関数
    function isSubdomainAvailable(
		ENS ens, bytes32 rootNode, string memory subdomain
    ) internal view returns (bool) {
        bytes32 subdomainHash = keccak256(abi.encodePacked(rootNode, keccak256(abi.encodePacked(subdomain))));
        return ens.owner(subdomainHash) == address(0);
    }
}
