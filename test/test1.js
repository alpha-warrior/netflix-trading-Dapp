const Netflix = artifacts.require("Netflix");
const EthCrypto = require("eth-crypto");
const web3 = require("web3");
const buyerid = EthCrypto.createIdentity();
const sellerid = EthCrypto.createIdentity();
const bpublic = buyerid.publicKey;
const bprivate = buyerid.privateKey;
const spublic = sellerid.publicKey;
const sprivate = sellerid.privateKey;
const item1 = "I_am_the_Password_for_Screen1";
const item2 = "I_am_the_Password_for_Screen2";

contract("Netflix", (accounts) => {
    let [buyer, seller] = accounts;
    it("simulates a whole transaction", async () => {
        const contractInstance = await Netflix.new();
        console.log("\n\nStarting test");
        let avail = await contractInstance.viewAvailItems({from: buyer});
        console.log(avail);
        console.log("\nListing new item.")
        await contractInstance.listItem("Screen 1", "new Netflix Screen", 100000, {from: seller});
        await contractInstance.listItem("Screen 2", "The Best Netflix Screen", 500000, {from: seller});
        avail = await contractInstance.viewAvailItems({from: buyer});
        console.log(avail);
        console.log("\nBuyer liked Screen 2, hence he is buying it")
        await contractInstance.buyItem(1, bpublic, {from: buyer, value:500000});
        console.log("\nScreen 2 should now be removed from the listing, lets check")
        avail = await contractInstance.viewAvailItems({from: buyer});
        console.log(avail);
        let pk = await contractInstance.get_public_key(1, {from: seller});
        assert.equal(pk, bpublic);
        const encrypted = await EthCrypto.encryptWithPublicKey(pk, item2);
        console.log("\nEncrypted string:")
        console.log(encrypted)
        await contractInstance.send_encrypted_string(EthCrypto.cipher.stringify(encrypted) ,1, {from: seller});
        let es = await contractInstance.get_encrypted_string(1, {from: buyer});
        assert.equal(es, EthCrypto.cipher.stringify(encrypted));
        const decrypted = await EthCrypto.decryptWithPrivateKey(bprivate, EthCrypto.cipher.parse(es));
        console.log("\nDecrypted string:")
        console.log(decrypted)
        assert.equal(decrypted, item2);
    })
})
