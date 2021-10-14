const Tx = require('ethereumjs-tx')
const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
// const url = 'https://goerli.infura.io/v3/4a0069358ad94ee5952e5aa45a452404';

const url = 'wss://goerli.infura.io/ws/v3/4a0069358ad94ee5952e5aa45a452404';
const privateKey = '369f978d44b827f5213a97240d9cce735fad85a2edfd14d84057d349693bbc92';
const address = '0xd8B1717D637e81F592f4D1c7f8B934Eb5d614C82';
const contract_addr = '0x78852c12fc08065e2eeD2CFeed622f372EaE3D8a';

const provider = new Provider(privateKey, url);
const web3 = new Web3(provider);


// contract
const MyContract = require('../build/contracts/Transcript.json');


MainApp = {

    account: "",
    web3Provider: provider,
    contracts: {},
    transcript: null,

    load: async () => {
        await MainApp.loadContracts();
        await MainApp.loadAccount();
    },


    // load user's account
    loadAccount: async () => {
        MainApp.account = await web3.eth.getAccounts();
        console.log(MainApp.account[0]);
    },

    loadContracts: async () => {
      
        MainApp.contracts.Transcript = new web3.eth.Contract(
            MyContract.abi,
            contract_addr
        );
        // MainApp.contracts.Transcript.setProvider(MainApp.web3Provider);
        // MainApp.transcript = await MainApp.contracts.Transcript.deployed();
        // console.log(trans); 
    },

    // creating a new student
    createStudent: async (student) => {
      // create an address
      const account = await web3.eth.accounts.create()
      let nadrr = account.address; // public key
      let y = account.privateKey;
      
      // create student
      const we = await MainApp.contracts.Transcript.methods.createStudent(
        student.email,
        student.name,
        student.matric,
        nadrr,
        student.faculty,
        student.department,
        student.duration,
        student.gender
      ).send({from: address});
      // console.log(we);
      // return private key and public key
      console.log('returning');
      return account;
    },

    createTranscript: async (data) => {
      // make sure student exists on the network
      const we = await MainApp.contracts.Transcript.methods.createTranscript(
        data.student.public_key,
        data.session,
        data.course.code,
        data.course.title,
        data.course.credit_load,
        data.grade,
        data.remark
      ).send({from: address});
      // get student's key
      // create transcript
    },

    getTranscript: async (key, email) => {
      const ctr = await MainApp.contracts.Transcript.methods.counter(key).call();
      const user = await MainApp.contracts.Transcript.methods.students(key).call();
      const res = [];
      for (let i = 0; i < ctr; i++){
        res.push(await MainApp.contracts.Transcript.methods.results(key, i).call());
      }

      console.log(user)


      return {user: user, data: res, receiver: email};
    },

    test: async () => {
      const we = await MainApp.contracts.Transcript.methods.counter('0x9BFC38692ac94894c1bC0F9395FF0e3D91629543').call();
      console.log(we);
    }
}

MainApp.loadContracts();
module.exports = MainApp;