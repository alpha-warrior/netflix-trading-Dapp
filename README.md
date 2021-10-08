# Ethereum Smart Contract to buy and sell Netflix Screens securely over a Blockchain
This work was done for the course Distributing Trust and Blockchains offered in A2k21 by Dr. Sujit Gujjar. The project has been coded in **Solidity** and is deployed using **Truffle**. **Doxygen** comments are enabled for the code and can be accessed using the index.html file in the html folder.

### Team **KATtana**: Kushagra, Akshit and Tathagata
---

The working logic for the code is described below:

1. A Seller lists a new item (Netflix screen) using the listItem() function and provides a name, description and price for the newly listed item.
2. A Potential buyer of a Netflix screen can view all the available listings using the viewAwailItems() function.
3. The buyer has chosen the screen he wants to buy and then calls the buyItem() function providing the listing id of the screen and his public key. His public key is important as it will be used to encrypt the Netflix password so that no one else can access it. When he calls the buyItem() function he is expected to also send Wei equal to the price of the screen in the msg.value parameter. This is stored in the Contract's address for now.
4. The Seller of the product first fetches the Buyer's public key using the get_public_key() function.
5. On getting the public key, the Seller encrypts the Netflix password and creates the cipher text which it then sends to the Seller using the send_encrypted_string() function. As soon as the encrypted cipher text is sent to the Buyer, the price for the Screen, which was staged in the Contract's address, is transferred to the Seller's account.
6. The Buyer can then fetch the encrypted string using the get_encrypted_string() function and then decrypt it using his private key. He has now retrieved the Netflix Password and can now **Netflix and Chill**
---

A sample run of the contract can be found in test/test1.js. Detailed description of the test case with comments and checks can also be found in test_run.txt.

To run the contract:

1) truffle compile
2) truffle develop
3) migrate
4) const contractInstance = await Netflix.new();
5) const EthCrypto = require("eth-crypto");

---

### TEST CASE

Let us assume that accounts[1] is a Seller, accounts[2] is also a Seller and accounts[3] is a buyer.

0. Account Balances in the start. After deployment:

    ``truffle(develop)> web3.eth.getBalance(accounts[0])
    '99992014102000000000'
    truffle(develop)> web3.eth.getBalance(accounts[1])
    '100000000000000000000'
    truffle(develop)> web3.eth.getBalance(accounts[2])
    '100000000000000000000'
    truffle(develop)> web3.eth.getBalance(accounts[3])
    '100000000000000000000'``

1. accounts[1] is now listing a screen up for sale.

    ``truffle(develop)> await contractInstance.listItem("Screen 1", "new Netflix Screen", 1000000, {from: accounts[1]});
    {
    tx: '0x6b7850097ec54079dd023b7774369c606dd6db05f4b96c52929a956c0295ce2b',
    receipt: {
        transactionHash: '0x6b7850097ec54079dd023b7774369c606dd6db05f4b96c52929a956c0295ce2b',
        transactionIndex: 0,
        blockHash: '0x4f0f163040a7e02a42baa80172121f6fda1bfa44543421cfdd1101902e076326',
        blockNumber: 6,
        from: '0xc7808c60694ba0919a0e91736eaed0e2d5581c95',
        to: '0x7cee8a45dfd1fbf0ec883a392322eff9b03c04c4',
        gasUsed: 259343,
        cumulativeGasUsed: 259343,``

2. Let us see if the screen was listed for buyer (accounts[3]) to see.

    ``truffle(develop)> let avail = await contractInstance.viewAvailItems({from: accounts[3]});
    undefined
    truffle(develop)> avail
    '\n' +
    '\n' +
    '**************************\n' +
    'Listing Id: 0\n' +
    'Name: Screen 1\n' +
    'Description: new Netflix Screen\n' +
    'Price: 1000000\n' +
    '***************************'``

3. accounts[2] is now listing a screen up for sale.

    ``truffle(develop)> await contractInstance.listItem("Screen 2", "The Best Netflix Screen", 500000, {from: accounts[2]});
    {
    tx: '0x5dc2864b64bfe55da507e30c790084d23b2144a866fe5806421e23a649277156',
    receipt: {
        transactionHash: '0x5dc2864b64bfe55da507e30c790084d23b2144a866fe5806421e23a649277156',
        transactionIndex: 0,
        blockHash: '0xa28ef4cbe5922c273ded3e3f47ff35ccdb4d70156791bb507c5ad9cc8d562b1e',
        blockNumber: 7,
        from: '0xb2d2168ea41b9cbb8a151b7ed23f45fb66d5507b',
        to: '0x7cee8a45dfd1fbf0ec883a392322eff9b03c04c4',
        gasUsed: 233603,
        cumulativeGasUsed: 233603,``

4. Available listings now.

    ``truffle(develop)> avail = await contractInstance.viewAvailItems({from: accounts[3]});
    undefined
    truffle(develop)> avail
    '\n' +
    '\n' +
    '**************************\n' +
    'Listing Id: 0\n' +
    'Name: Screen 1\n' +
    'Description: new Netflix Screen\n' +
    'Price: 1000000\n' +
    '\n' +
    '**************************\n' +
    'Listing Id: 1\n' +
    'Name: Screen 2\n' +
    'Description: The Best Netflix Screen\n' +
    'Price: 500000\n' +
    '***************************'``

5. Buyer likes Screen 2 as it is the Best Netflix screen so he buys it.

    a) Buyer's account balance before the buy operation:

        truffle(develop)> web3.eth.getBalance(accounts[3])
        '100000000000000000000'

    b) Creating 2 sets of public and private keys for buyer and seller:

        const buyerid = EthCrypto.createIdentity();
        undefined
        truffle(develop)> buyerid
        {
        address: '0x59ab125fcDc4cA60Bf66ED402048D5e472fa8F89',
        privateKey: '0x0e055f5de61ad3e98a0a3b734cd1c56c00990402a7eae7f69f649ffecf406708',
        publicKey: 'c04f382fc16f3abffd922fac75c933daedc75c19fa3b1caf8212794fce6978213d4228c35c2413641c500919b2eb7440a620701f9dcbde8c3e5e0ac38881fa1a'
        }
        truffle(develop)> const sellerid = EthCrypto.createIdentity();
        undefined
        truffle(develop)> sellerid
        {
        address: '0xA84d007B8351B87b48A4E8998E1dDD1D9dA89f6C',
        privateKey: '0xadb218e7a9c9da1004184d837fb956ce2c1175673dd432ede54f07ea3f28f3f4',
        publicKey: '2adc02ad8e1f2610ed31f9b7bd2f06837370612e6cb979c8d6faef1e3d5b0234bbc183bd6766c0e96b6b5b63a8b0216fc69a08f8770edd64cc6f574f142b849c'
        }

    c) Giving "buyerid.publicKey" as the public key for buying:

        truffle(develop)> await contractInstance.buyItem(1, buyerid.publicKey , {from: accounts[3], value:500000});
        {
        tx: '0x38a1d60387a391d00e0e008072408b8c25b459d6e0f1dff569659ce7807f8c8e',
        receipt: {
            transactionHash: '0x38a1d60387a391d00e0e008072408b8c25b459d6e0f1dff569659ce7807f8c8e',
            transactionIndex: 0,
            blockHash: '0xea1ed4512487a614093c5d36981ef8b5866c51e4b633ad0c950254b91bc3b3a8',
            blockNumber: 8,
            from: '0x1579f7fdac049c0144a1d0237434895d4b704d79',
            to: '0x7cee8a45dfd1fbf0ec883a392322eff9b03c04c4',
            gasUsed: 220244,
            cumulativeGasUsed: 220244,
 
    d) Let us see if the Buyer's account balance has reduced by 500000 (apart from gas fees):

        truffle(develop)> web3.eth.getBalance(accounts[3])
        '99999559511999500000'

    e) Let us check if the item has now been removed from the listing:

        truffle(develop)> avail = await contractInstance.viewAvailItems({from: accounts[3]});
        undefined
        truffle(develop)> avail
        '\n' +
        '\n' +
        '**************************\n' +
        'Listing Id: 0\n' +
        'Name: Screen 1\n' +
        'Description: new Netflix Screen\n' +
        'Price: 1000000\n' +
        '***************************'

6. The Seller now needs to fetch the Buyer's public key:

    ``truffle(develop)> let pk = await contractInstance.get_public_key(1, {from: accounts[2]});
    undefined
    truffle(develop)> pk
    'c04f382fc16f3abffd922fac75c933daedc75c19fa3b1caf8212794fce6978213d4228c35c2413641c500919b2eb7440a620701f9dcbde8c3e5e0ac38881fa1a'``


7. The Seller now encrypts the NETFLIX PASSWORD ("I_am_the_Password_for_Screen2") with the Buyer's public key:

    ``truffle(develop)> const encrypted = await EthCrypto.encryptWithPublicKey(pk, "I_am_the_Password_for_Screen2");
    undefined
    truffle(develop)> encrypted
    {
    iv: '26905f9f4fca63658735cfe832fdbea6',
    ephemPublicKey: '04c5f99c6760a9259b7910a9e5d71d405d99df2c0eaa573b32fe09714f335a9c6391aed529c223f0e25dc58e263d6f54ef07e4bca5e37fc2ad8683ac951c4726a5',
    ciphertext: '6ce302c9bca84e958e47da1696b50ece95c446f0f2e6c261e74ffa334cb5a4a2',
    mac: '7718cbc31ce78c0bf1ba1ef0fefca92ce86a7e2747df44b5e6970b38d0a6ad0d'
    }``

8. Now sending this encrypted ciphertext from seller:

    a) Sending the ciphertext:

        truffle(develop)> await contractInstance.send_encrypted_string(EthCrypto.cipher.stringify(encrypted) ,1, {from: accounts[2]});
        {
        tx: '0x1708b10798cf856e4abc17f85b6a8d551c7d0575b3466ab864bbc43bc89cdaf7',
        receipt: {
            transactionHash: '0x1708b10798cf856e4abc17f85b6a8d551c7d0575b3466ab864bbc43bc89cdaf7',
            transactionIndex: 0,
            blockHash: '0x7d23cd7954ad82e5efee613f498646ed8123d1b53534b7d875fe7c584e490b5a',
            blockNumber: 9,
            from: '0xb2d2168ea41b9cbb8a151b7ed23f45fb66d5507b',
            to: '0x7cee8a45dfd1fbf0ec883a392322eff9b03c04c4',
            gasUsed: 231430,
            cumulativeGasUsed: 231430,

    b) The account balance of the Seller should increase by 500000:

        truffle(develop)> web3.eth.getBalance(accounts[2])
        '99999069934000500000'

9. Now the buyer fetches this encrypted string:

    ``truffle(develop)> let es = await contractInstance.get_encrypted_string(1, {from: accounts[3]});
    undefined
    truffle(develop)> es
    '26905f9f4fca63658735cfe832fdbea603c5f99c6760a9259b7910a9e5d71d405d99df2c0eaa573b32fe09714f335a9c637718cbc31ce78c0bf1ba1ef0fefca92ce86a7e2747df44b5e6970b38d0a6ad0d6ce302c9bca84e958e47da1696b50ece95c446f0f2e6c261e74ffa334cb5a4a2'``

10. The buyer now decrypts the encrypted string:

    ``truffle(develop)> const decrypted = await EthCrypto.decryptWithPrivateKey(buyerid.privateKey, EthCrypto.cipher.parse(es));
    undefined
    truffle(develop)> decrypted
    'I_am_the_Password_for_Screen2'``

The buyer got the password: **'I_am_the_Password_for_Screen2'** and can now **NETFLIX AND CHILL!!!!**

---









