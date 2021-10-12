# Ethereum DAPP to conduct Auctions and enable buying and selling of Netflix Screens securely over a Blockchain
This work was done for the course Distributing Trust and Blockchains offered in A2k21 by Dr. Sujit Gujjar. The project has been coded in **Solidity** and is deployed using **Truffle**. **Doxygen** comments are enabled for the code and can be accessed using the index.html file in the html folder. The DAPP is deployed at localhost:3000 using JS.

This work is in continuation of the Ethereum Smart Contract repo which contains detailed information about the basic buying/selling functionality of Netflix screens over the Blockchain.

### Team **KATtana**: Kushagra, Akshit and Tathagata
---

To run the contract:

On Terminal1:

1) truffle compile
2) truffle develop
3) migrate
4) const contractInstance = await Netflix.deployed();

On Terminal2:

1) npm install (only for the first run)
2) npm run dev

---

The DAPP allows a Seller to list his Netflix screen normally or conduct auctions to sell it. Three types of Auctions are supported:

1) First-price sealed-bid auction
2) Vickrey auction/Second-price sealed-bid auction
3) Average price auction

The password for the Netflix screen is transferred securely over the blockchain using encryptions which can be only decrypted by the buyer/auction winner using his privately generated key.

---