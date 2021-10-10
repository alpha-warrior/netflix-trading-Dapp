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
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Netflix.json", function(netflix) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Netflix = TruffleContract(netflix);
      // Connect provider to interact with contract
      App.contracts.Netflix.setProvider(App.web3Provider);
      // App.listenForEvents();
      return App.render();
    });
  },
  render: function() {
    var electionInstance;
    var content = $("#content");
    
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
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

$(function() {
  $(window).load(function() {
    App.init();
  });
});