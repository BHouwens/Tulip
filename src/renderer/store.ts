import { makeAutoObservable } from 'mobx';
import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { NAME_OPTIONS } from './name_options';
import { ETHERSCAN_API_KEY } from './constants';

interface IAccountStored {
  name: string;
  watch: boolean;
  lastData: any[];
}

class Store {
  isLoading: boolean = false;
  currentView: string = 'home';
  viewData: any = null;
  account: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.startWatching();
  }

  convertMinsToMs(mins: number): number {
    return mins * 60 * 1000;
  }

  formatAddressForDisplay(address: string): string {
    return address.replace(/^(.{4}).*(.{4})$/, '$1...$2');
  }

  public async startWatching() {
    const accounts = Object.keys(localStorage);
    for (const account of accounts) {
      const rawAccount = localStorage.getItem(account);
      const parsedAccount = rawAccount ? JSON.parse(rawAccount) : {};
      
      if (parsedAccount.watch) {
        this.watchAccount(account, parsedAccount);
      }
    }
  }

  public async watchAccount(accountName: string, account: IAccountStored) {
    const { name } = account;

    setInterval(async () => {
      const newData = await this.fetchAccountFromEtherscan(accountName, false);
      console.log('localStorage.getItem(accountName)', localStorage.getItem(accountName));
      const lastData = localStorage.getItem(accountName) ? JSON.parse(localStorage.getItem(accountName) as string).lastData : null;
      
      console.log('newData', newData.result[0].timeStamp);
      console.log('lastData', lastData && lastData.length && lastData[0] ? lastData[0].timeStamp : null);
      
      if (
        !lastData || !lastData.length ||
        (newData && lastData && lastData.length && newData.result[0].timeStamp != lastData[0].timeStamp)
      ) {

        window.electron.ipcRenderer.sendMessage('watch-notify', [name, accountName]);
        this.setViewWithData('account', newData, accountName, true);
        account.lastData = newData.result;
      }
    }, this.convertMinsToMs(5));
  }

  public setViewWithData(view: string, data: any, account: string, force: boolean = false) {
    this.currentView = view;
    this.viewData = data.result;
    this.account = account;

    // Update if we watch this one
    if (Object.keys(localStorage).indexOf(account) != -1 || force) {
      const rawAccount = localStorage.getItem(account);
      if (rawAccount) {
        const parsedAccount = JSON.parse(rawAccount);
        parsedAccount.lastData = data.result;

        console.log('new Data', data.result);
        console.log('parsedAccount', parsedAccount);
        localStorage.setItem(account, JSON.stringify(parsedAccount));
      }
    }
  }

  public saveCurrentAccount() {
    if (!localStorage.getItem(this.account as string)) {
      const name =
        NAME_OPTIONS[Math.floor(Math.random() * NAME_OPTIONS.length)];
      const lastData = this.viewData;

      localStorage.setItem(
        this.account as string,
        JSON.stringify({ watch: false, name, lastData })
      );

      toast.success(`Saved ${this.formatAddressForDisplay(this.account as string)} as ${name}`);
    }
  }

  public watchCurrentAccount() {
    const rawAccount = localStorage.getItem(this.account as string);
    if (rawAccount) {
      const account = JSON.parse(rawAccount);
      account.watch = true;
      localStorage.setItem(this.account as string, JSON.stringify(account));

      toast.success(`Started watching ${this.formatAddressForDisplay(this.account as string)}`);
    } else {
      toast.error('Could not find account');
    }
  }

  public async fetchAccountFromEtherscan(
    account: string,
    setAsViewData = true
  ) {
    console.log('account in fetchAccount', account);
    const result = await axios.get(
      `https://api.etherscan.io/api?module=account&action=tokentx&address=${account}&page=1&offset=10&startblock=0&endblock=27025780&sort=desc&apikey=${ETHERSCAN_API_KEY}`
    );

    console.log(result.data);
    if (setAsViewData) {
      console.log("setting view with data");
      this.setViewWithData('account', result.data, account);
    }

    return result.data;
  }
}

const StoresContext = React.createContext(new Store());
export const useStores = (): Store => React.useContext(StoresContext);
