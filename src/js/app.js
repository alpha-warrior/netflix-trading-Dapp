// import EthCrypto from 'eth-crypto';
// const EthCrypto = require("./eth-crypto/src").default;
App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    App.ethcryp = EthCrypto
    App.solsha = SolSha3
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    console.log(App.ethcryp)
    console.log(App.solsha)
    return await App.initContract();
  },

  initContract: async function() {
    
    $.getJSON("Netflix.json", function(netflix) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Netflix = TruffleContract(netflix);
      // Connect provider to interact with contract
      App.contracts.Netflix.setProvider(App.web3Provider);
      
      // App.listenForEvents();
      return App.render();
    });
  },
  render: async function() {
    var electionInstance;
    var content = $("#content");
    // Load account data
    await web3.eth.getCoinbase(async function(err, account) {
      await App.contracts.Netflix.deployed().then(async function(instance) {
        console.log("abcd")
        console.log(App.account)
        console.log("abcd")
        var listedItems = $("#listedItems");
        var res = await instance.viewAvailItems({from: App.account});
        res = res.split('\n')
        console.log(res)
        listedItems.html(res);
        var candidatesResults = $("#candidatesResults");
        candidatesResults.empty();
  
        for (var i = 0; i < res.length; i++) {
            if (res[i].length == 0){
              continue;
            }
            tmp = res[i].split(';')
            var id = tmp[0].split(':')[1];
            var name = tmp[1].split(':')[1];
            var des = tmp[2].split(':')[1];
            var price = tmp[3].split(':')[1];
            var stype = tmp[4].split(':')[1];
            // Render candidate Result
            var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + des + "</td><td>" + price+ "</td><td>" + stype + "</td></tr>"
            candidatesResults.append(candidateTemplate);
        }
        
        var soldItems = $("#listedItems");
        var res2 = await instance.get_bought_item_statuses({from: App.account});
        res2 = res2.split('\n')
        console.log(res2)
        soldItems.html(res2);
        var candidatesResults2 = $("#candidatesResults2");
        candidatesResults2.empty();

        for (var i = 0; i < res2.length; i++) {
          if (res2[i].length == 0){
            continue;
          }
          tmp = res2[i].split(';')
          var id = tmp[0].split(':')[1];
          var name = tmp[1].split(':')[1];
          var des = tmp[2].split(':')[1];
          var price = tmp[3].split(':')[1];
          var stype = tmp[4].split(':')[1];
          var status_is = tmp[5].split(":")[1];
          // Render candidate Result
          var candidateTemplate2 = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + des + "</td><td>" + price+ "</td><td>" + stype + "</td><td>" + status_is + "</td></tr>"
          candidatesResults2.append(candidateTemplate2);
      }

      }).catch(function(error) {
        console.warn(error);
        console.log(error)
      });
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
      else{
        $("#accountAddress").html("Account not detected");
        console.log("Account not detected")
      }
    });

    // Load contract data
  //   App.contracts.Election.deployed().then(function(instance) {
  //     electionInstance = instance;
  //     return electionInstance.candidatesCount();
  //   }).then(function(candidatesCount) {
  //     var candidatesResults = $("#candidatesResults");
  //     candidatesResults.empty();

  //     var candidatesSelect = $('#candidatesSelect');
  //     candidatesSelect.empty();

  //     for (var i = 1; i <= candidatesCount; i++) {
  //       electionInstance.candidates(i).then(function(candidate) {
  //         var id = candidate[0];
  //         var name = candidate[1];
  //         var voteCount = candidate[2];

  //         // Render candidate Result
  //         var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
  //         candidatesResults.append(candidateTemplate);

  //         // Render candidate ballot option
  //         var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
  //         candidatesSelect.append(candidateOption);
  //       });
  //     }
  //     return electionInstance.voters(App.account);
  //   }).then(function(hasVoted) {
  //     // Do not allow a user to vote
  //     if(hasVoted) {
  //       $('form').hide();
  //     }
  //     loader.hide();
  //     content.show();
  //   }).catch(function(error) {
  //     console.warn(error);
  //   });
  },


  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function() {
    /*
     * Replace me...
     */
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    
  }

};
window.addEventListener('load', async () => {
  try {
             await ethereum.enable();
         } catch (error) {}
         App.init();
  });  
$("#addi").submit(function(e) {
    e.preventDefault();
});
$("#buyi").submit(function(e) {
  e.preventDefault();
});
$("#getpkeyi").submit(function(e) {
  e.preventDefault();
});

$("#close_bid").submit(function(e) {
  e.preventDefault();
});
$("#reveal_bid").submit(function(e) {
  e.preventDefault();
});
$("#query_bid").submit(function(e) {
  e.preventDefault();
});
async function add_item(){  
  var name=document.getElementById("name").value;  
  var description=document.getElementById("description").value;  
  var price=document.getElementById("price").value;  
  var type=document.getElementById("type").value;
  await web3.eth.getCoinbase(async function(err, account) {
    await App.contracts.Netflix.deployed().then(async function(instance) {
      console.log("abcd")
      console.log(name + description + price + type)
      await instance.listItem(name, description, parseInt(price), parseInt(type),{from: App.account});
      alert("Item Listed successfully");
      document.location.reload();
    })
  })
  
}  

async function buy_item(){  
  var id=document.getElementById("b_item_id").value;
  var ether=document.getElementById("b_price").value;
  var pkey=document.getElementById("pkey").value;
  if(document.getElementById("normal").checked){
    await web3.eth.getCoinbase(async function(err, account) {
      await App.contracts.Netflix.deployed().then(async function(instance) {
        await instance.buyNormalItem(parseInt(id),pkey, {from: App.account, value:parseInt(ether)}).then(function (res){
          alert("Item Bought succesfully");
          document.location.reload();
          console.log(res)
        }).catch(function(error) {
          var temp = error.data.message.split(":")[1].split(" ");
          temp.shift();
          temp.shift();
          if (temp instanceof Array) {
            temp2 = temp.join(' ');
          }
          else {
            temp2 = temp;
          }
          console.log(temp2)
          alert(temp2)
          // console.warn(error);
          // console.log(error)
          // alert("Error in Buying Item")
        });
        
      })
    })
  }
  else{
    await web3.eth.getCoinbase(async function(err, account) {
      await App.contracts.Netflix.deployed().then(async function(instance) {
        await instance.buyAuctionItem(parseInt(id),pkey, {from: App.account, value:parseInt(ether)}).then(function (res){
          alert("Auction Item Bought succesfully");
          document.location.reload();
          console.log(res)
        }).catch(function(error) {
          var temp = error.data.message.split(":")[1].split(" ");
          temp.shift();
          temp.shift();
          if (temp instanceof Array) {
            temp2 = temp.join(' ');
          }
          else {
            temp2 = temp;
          }
          console.log(temp2)
          alert(temp2)
          // console.warn(error);
          // console.log(error)
          // alert("Error in Buying Item")
        });
      })
    })
  }
}  
async function get_public_key(){  
  var id=document.getElementById("gpk_item_id").value;
  await web3.eth.getCoinbase(async function(err, account) {
    await App.contracts.Netflix.deployed().then(async function(instance) {
      await instance.get_public_key(parseInt(id), {from: App.account}).then(function (res){
        alert("Public Key: " + res);
        $("#gpk_pk").html(res);
        console.log(res)
      }).catch(function(error) {

        var temp = error.data.message.split(":")[1].split(" ");
        temp.shift();
        temp.shift();
        if (temp instanceof Array) {
          temp2 = temp.join(' ');
        }
        else {
          temp2 = temp;
        }
        console.log(temp2)
        alert(temp2)
        
        // console.log(error)
        // alert("Error in receiving Public Key")
      });
    })
  })
}


async function encrypt_content(){  
  console.log("encrypt_content()")
  var pk=document.getElementById("gpk_pk").value;
  var content = document.getElementById("gpk_content").value;
  var encrypted = await App.ethcryp.encryptWithPublicKey(pk, content);
  encrypted = await App.ethcryp.cipher.stringify(encrypted)
  console.log(encrypted)
  $("#gpk_encrypted").html(encrypted);
}

async function send_encrypted(){  
  var encrypted=document.getElementById("gpk_encrypted").value;
  var id=document.getElementById("gpk_item_id").value;
  await web3.eth.getCoinbase(async function(err, account) {
    await App.contracts.Netflix.deployed().then(async function(instance) {
      await instance.send_encrypted_string(encrypted,parseInt(id), {from: App.account}).then(function (res){
        console.log(res)
        alert("Encrypted string sent")
        document.location.reload();
      }).catch(function(error) {
        var temp = error.data.message.split(":")[1].split(" ");
        temp.shift();
        temp.shift();
        if (temp instanceof Array) {
          temp2 = temp.join(' ');
        }
        else {
          temp2 = temp;
        }
        console.log(temp2)
        alert(temp2)
        // console.log(error)
        // alert("Error in sending Encrypted string")
      });
    })
  })
}


async function get_encrypted_string(){  
  var id=document.getElementById("db_item_id").value;
  await web3.eth.getCoinbase(async function(err, account) {
    await App.contracts.Netflix.deployed().then(async function(instance) {
      await instance.get_encrypted_string(parseInt(id), {from: App.account}).then(function (res){
        alert("Encrypted string recieved");
        $("#db_enc").html(res);
        console.log(res)
      }).catch(function(error) {
        var temp = error.data.message.split(":")[1].split(" ");
        temp.shift();
        temp.shift();
        if (temp instanceof Array) {
          temp2 = temp.join(' ');
        }
        else {
          temp2 = temp;
        }
        console.log(temp2)
        alert(temp2)
        // console.log(error)
        // alert("Error in receiving Encrypted string")
      });
    })
  })
}

async function decrypt_content(){  
  console.log("encrypt_content()")
  var encrypted=document.getElementById("db_enc").value;
  var pvk = document.getElementById("db_pvk").value;
  encrypted = App.ethcryp.cipher.parse(encrypted)
  var decrypted = await App.ethcryp.decryptWithPrivateKey(pvk, encrypted);
  console.log(decrypted)
  $("#db_msg").html(decrypted);
}

async function hash_price(){  
  console.log("hash_price()")
  var bid_price=document.getElementById("bi_price").value;
  var hash = App.solsha.default(parseInt(bid_price))
  $("#bi_hash").html(hash);
}

async function submit_bid(){  
  var hash=document.getElementById("bi_hash").value;
  var id = document.getElementById("bi_item_id").value;
  await web3.eth.getCoinbase(async function(err, account) {
    await App.contracts.Netflix.deployed().then(async function(instance) {
      await instance.place_bid(parseInt(id), hash, {from: App.account}).then(function (res){
        alert("Bid Placed");
        $("#db_enc").html(res);
        console.log(res)
      }).catch(function(error) {
        var temp = error.data.message.split(":")[1].split(" ");
        temp.shift();
        temp.shift();
        if (temp instanceof Array) {
          temp2 = temp.join(' ');
        }
        else {
          temp2 = temp;
        }
        console.log(temp2)
        alert(temp2)
        // console.log(error)
        // alert("Error in Placing Bid")
      });
    })
  })
}

async function reveal_bid(){  
  var price=document.getElementById("rvb_price").value;
  var id = document.getElementById("rvb_id").value;
  await web3.eth.getCoinbase(async function(err, account) {
    await App.contracts.Netflix.deployed().then(async function(instance) {
      await instance.reveal_bid(parseInt(id), parseInt(price), {from: App.account}).then(function (res){
        alert("Bid Revealed successfully");
        document.location.reload();
        console.log(res)
      }).catch(function(error) {
        var temp = error.data.message.split(":")[1].split(" ");
        temp.shift();
        temp.shift();
        if (temp instanceof Array) {
          temp2 = temp.join(' ');
        }
        else {
          temp2 = temp;
        }
        console.log(temp2)
        alert(temp2)
        // console.log(error)
        // alert("Error in Revealing Bid")
      });
    })
  })
}



async function close_bid(){  
  var id = document.getElementById("rb_id").value;
  await web3.eth.getCoinbase(async function(err, account) {
    await App.contracts.Netflix.deployed().then(async function(instance) {
      await instance.close_bidding(parseInt(id), {from: App.account}).then(function (res){
        alert("Bidding Period closed and Reveal Period started");
        document.location.reload();
        console.log(res)
      }).catch(function(error) {
        var temp = error.data.message.split(":")[1].split(" ");
        temp.shift();
        temp.shift();
        if (temp instanceof Array) {
          temp2 = temp.join(' ');
        }
        else {
          temp2 = temp;
        }
        console.log(temp2)
        alert(temp2)
        // console.log(error)
        // alert("Error in closing Bidding Period")
      });
    })
  })
}

async function close_reveal(){  
  var id = document.getElementById("cb_id").value;
  await web3.eth.getCoinbase(async function(err, account) {
    await App.contracts.Netflix.deployed().then(async function(instance) {
      await instance.close_revealing(parseInt(id), {from: App.account}).then(function (res){
        alert("Reveal Period closed");
        document.location.reload();
        console.log(res)
      }).catch(function(error) {
        var temp = error.data.message.split(":")[1].split(" ");
        temp.shift();
        temp.shift();
        if (temp instanceof Array) {
          temp2 = temp.join(' ');
        }
        else {
          temp2 = temp;
        }
        console.log(temp2)
        alert(temp2)
        // console.log(error)
        // alert("Error in closing Reveal Period")
      });
    })
  })
}

function generate_keys(){
  newid = App.ethcryp.createIdentity()
  alert("Save the private key for future reference.\nPublic key: "+ newid.publicKey+"\nPrivate key: "+ newid.privateKey)
  $("#pkey").html(newid.publicKey);
  $("#private_key").html(newid.privateKey);
  console.log(newid)
}

async function query_bid(){
  var id = document.getElementById("qb_id").value;
  await web3.eth.getCoinbase(async function(err, account) {
    await App.contracts.Netflix.deployed().then(async function(instance) {
      await instance.get_winner(parseInt(id), {from: App.account}).then(async function (res){
        if(res == App.account){
          ether = await instance.get_payable_amount(parseInt(id), {from: App.account})
          alert("Congrats! You won the auction for Item "+ id+ ".\nWei to be paid: "+ ether)
          console.log(ether)
        }
        else{
          alert("Oops! You are not the winner of the auction for Item "+ id)
        }
        console.log(res)
      }).catch(function(error) {
        var temp = error.data.message.split(":")[1].split(" ");
        temp.shift();
        temp.shift();
        if (temp instanceof Array) {
          temp2 = temp.join(' ');
        }
        else {
          temp2 = temp;
        }
        console.log(temp2)
        alert(temp2)
        // alert("Error in querying the winner")
        // console.log(error)
      });
    })
  })
}
// $(function() {
//   $(window).load(function() {
//     App.init();
//   });
// });