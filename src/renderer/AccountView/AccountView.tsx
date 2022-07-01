import { useObserver } from 'mobx-react-lite';
import { useStores } from '../store';
import IconList from '../IconList/IconList';
import './AccountView.css';

const AccountView = () => {
  const Store = useStores();

  const header = [
    { value: 'Time', isNumeric: false },
    { value: 'Value', isNumeric: false },
    { value: 'Direction', isNumeric: false },
    { value: 'Token', isNumeric: false },
  ];

  const timeConverter = (timestamp: number) => {
    const a = new Date(timestamp * 1000);
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate() < 10 ? `0${a.getDate()}` : a.getDate();
    const hour = a.getHours() < 10 ? `0${a.getHours()}` : a.getHours();
    const min = a.getMinutes() < 10 ? `0${a.getMinutes()}` : a.getMinutes();
    const sec = a.getSeconds() < 10 ? `0${a.getSeconds()}` : a.getSeconds();
    const time = `${date} ${month} ${year} - ${hour}:${min}:${sec}`;
    return time;
  };

  const formatValue = (value: string, decimals: string): number => {
    const valueNumber = parseFloat(value);
    const decimalsNumber = parseInt(decimals);
    return parseFloat((valueNumber / Math.pow(10, decimalsNumber)).toFixed(2));
  };

  const outComponent = () => {
    return <div className="tag out">OUT</div>;
  };

  const inComponent = () => {
    return <div className="tag in">IN</div>;
  };

  const constructBody = () => {
    const body = [];

    if (!Store.viewData) { return []; }

    for (const rowData of Store.viewData) {
      const row = [];
      row.push({ value: timeConverter(rowData.timeStamp), isNumeric: false });
      row.push({
        value: formatValue(rowData.value, rowData.tokenDecimal),
        isNumeric: false,
      });
      row.push({
        value: rowData.from === Store.account ? outComponent() : inComponent(),
        isNumeric: false,
      });
      row.push({
        value: `${rowData.tokenName} (${rowData.tokenSymbol})`,
        isNumeric: false,
      });
      body.push(row);
    }
    return body;
  };

  return useObserver(() => (
    <div className="accountViewContainer">
      <table>
        <thead>
          <tr>
            {header.map((headerData, index) => {
              return (
                <th
                  key={index}
                  className={headerData.isNumeric ? 'numeric' : ''}
                >
                  {headerData.value}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {constructBody().map((rowData, index) => {
            return (
              <tr key={index}>
                {rowData.map((cellData, index) => {
                  return (
                    <td
                      key={index}
                      className={cellData.isNumeric ? 'numeric' : ''}
                    >
                      {cellData.value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <a
        className="button"
        href={`https://etherscan.io/address/${Store.account}#tokentxns`}
        target="_blank"
      >
        View More
      </a>

      <div className="removeFromPositionLeft">
        <IconList />
      </div>
    </div>
  ));
};

export default AccountView;
