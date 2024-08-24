import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("deploy", (m) => {
  // デプロイ時に渡す引数を定義します
  const ensAddress = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
  const resolverAddress = "0x8FADE66B79cC9f707aB26799354482EB93a5B7dD";
  const name = "SAMPLE";

  // const forwarder = m.contract("Forwarder", [name]);
  // console.log(">> ", forwarder);
  const simpleSignContract = m.contract("SimpleSignContract", [ensAddress, resolverAddress, "0x7CCc6024f284f4EA2E5d63F0ABDaA4325DA7125b"]);

  return { simpleSignContract };
});