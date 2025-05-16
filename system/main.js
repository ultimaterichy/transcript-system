const { Web3 } = require('web3');
require('dotenv').config();

const url = process.env.GANACHE_URL || 'http://127.0.0.1:7545';
const privateKey = process.env.PRIVATE_KEY || '369f978d44b827f5213a97240d9cce735fad85a2edfd14d84057d349693bbc92';
const address = process.env.ADDRESS || '0xd8B1717D637e81F592f4D1c7f8B934Eb5d614C82';
const contract_addr = process.env.CONTRACT_ADDRESS || '0x78852c12fc08065e2eeD2CFeed622f372EaE3D8a';

// Initialize Web3 with Ganache provider
const web3 = new Web3(url);

// Add the private key to the wallet
web3.eth.accounts.wallet.add(privateKey);

// contract
const MyContract = require('../build/contracts/Transcript.json');

const MainApp = {
  account: "",
  web3Provider: web3,
  contracts: {},
  transcript: null,

  load: async () => {
    await MainApp.loadContracts();
    await MainApp.loadAccount();
  },

  // load user's account
  loadAccount: async () => {
    const accounts = await web3.eth.getAccounts();
    MainApp.account = accounts[0];
    console.log('Connected account:', MainApp.account);
  },

  loadContracts: async () => {
    try {
      MainApp.contracts.Transcript = new web3.eth.Contract(
        MyContract.abi,
        contract_addr
      );
      console.log('Contract loaded successfully');
    } catch (error) {
      console.error('Error loading contract:', error);
      throw error;
    }
  },

  // creating a new student
  createStudent: async (student) => {
    try {
      // create an address
      const account = web3.eth.accounts.create();
      const publicKey = account.address;
      const privateKey = account.privateKey;
      // console.log(publicKey, privateKey);
      // create student on blockchain
      const tx = await MainApp.contracts.Transcript.methods.createStudent(
        student.email,
        student.name,
        student.matric,
        publicKey,
        student.faculty,
        student.department,
        student.duration,
        student.gender
      ).send({ from: address });

      // console.log('Student created successfully:', tx);
      return { address: publicKey, privateKey };
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },

  createTranscript: async (data) => {
    try {
      const tx = await MainApp.contracts.Transcript.methods.createTranscript(
        data.student.publicKey,
        data.session,
        data.course.code,
        data.course.title,
        data.course.credit_load,
        data.grade,
        data.remark
      ).send({ from: address });

      console.log('Transcript created successfully:', tx);
      return tx;
    } catch (error) {
      console.error('Error creating transcript:', error);
      throw error;
    }
  },

  getTranscript: async (key, email) => {
    try {
      const counter = await MainApp.contracts.Transcript.methods.counter(key).call();
      const user = await MainApp.contracts.Transcript.methods.students(key).call();
      
      const results = await Promise.all(
        Array.from({ length: Number(counter) }, (_, i) => 
          MainApp.contracts.Transcript.methods.results(key, i).call()
        )
      );

      return { user, data: results, receiver: email };
    } catch (error) {
      console.error('Error getting transcript:', error);
      throw error;
    }
  },

  test: async () => {
    try {
      const counter = await MainApp.contracts.Transcript.methods.counter(
        '0x9BFC38692ac94894c1bC0F9395FF0e3D91629543'
      ).call();
      console.log('Test counter:', counter);
    } catch (error) {
      console.error('Test error:', error);
      throw error;
    }
  }
};

// Initialize the app
MainApp.loadContracts().catch(console.error);

module.exports = MainApp;