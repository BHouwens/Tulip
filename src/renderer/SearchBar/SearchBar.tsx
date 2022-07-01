import './SearchBar.css';
import { useState } from 'react';
import { useObserver } from 'mobx-react-lite';
import { useStores } from '../store';

const SearchBar = () => {
  const Store = useStores();
  const [isHomeClass, setIsHomeClass] = useState("active");

  const isValidAddress = (address: string) => {
    return address.length === 42;
  };

  const isValidSavedName = (name: string) => {
    let keys = Object.keys(localStorage);

    for (let key of keys) {
      const entry = localStorage.getItem(key);
      if (entry && JSON.parse(entry).name === name) {
        console.log("key", key)
        return [key, JSON.parse(entry)];
      }
    }

    return null;
  }

  const onAccountSupply = async (e: any) => {
    const { value } = e.target;

    if (isValidAddress(value)) {
      Store.fetchAccountFromEtherscan(value);
      setIsHomeClass("");
    }

    const savedAccount = isValidSavedName(value);
    console.log('savedAccount', savedAccount);

    if (savedAccount) {
      setIsHomeClass("");
      Store.currentView = 'account';
      Store.fetchAccountFromEtherscan(savedAccount[0]);
    }

    if (!value || !value.length || value == "") {
      Store.currentView = 'home';
    }
  };

  return useObserver(() => (
    <div className={`searchBarContainer ${isHomeClass}`}>
      <input
        className="searchBar"
        type="text"
        onChange={onAccountSupply}
        placeholder="Type your message here..."
      />
    </div>
  ));
};

export default SearchBar;
