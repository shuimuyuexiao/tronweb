// 使用 fetch API 加载 JSON 文件
const contractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // 替换为实际的 TRC20 合约地址

// 获取 TRX 余额
async function getTrxBalance(walletAddress) {
    try {
        const balance = await tronWeb.trx.getBalance(walletAddress);
        return tronWeb.fromSun(balance);  // 返回 TRX 的余额
    } catch (error) {
        console.error('Error fetching TRX balance:', error);
        return 'Error';
    }
}

// 获取USDT代币余额
async function getTrc20Balance(walletAddress) {
    try {
        const contract = await tronWeb.contract().at(contractAddress);
        const balance = await contract.balanceOf(walletAddress).call(({ from: walletAddress }));
        return tronWeb.fromSun(balance);  // 返回 TRC20 代币的余额
    } catch (error) {
        console.error('Error fetching TRC20 balance:', error);
        return 'Error';
    }
}

// 延迟函数
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 从外部 JSON 文件获取钱包列表
async function fetchWalletAdresses() {
    try {
        const response = await fetch('data.json');  // 假设钱包地址存放在 data.json 文件中
        const addresses = await response.json();
        return addresses;
    } catch (error) {
        console.error('Error fetching wallet list:', error);
        return [];
    }
}

// 批量查询钱包余额并更新表格
async function getBalances() {
    const walletAddresses = await fetchWalletAdresses();  // 获取钱包列表

    // 将 JSON 数据输出到页面中
    const balanceList = document.getElementById('data_content');

    for (let i = 0; i < walletAddresses.length; i++) {
        const walletAddress = walletAddresses[i];

        // 通过字符串拼接生成 HTML 代码
        let name = walletAddress.name;
        let address = walletAddress.address;

        // 获取 TRX 和 USDT 余额
        const trxBalance = await getTrxBalance(address);
        const trc20Balance = await getTrc20Balance(address);

        let newRowTr = `<tr>`;
        if(trc20Balance > 10){
            newRowTr = `<tr class="trbg">`;
        }

        const newRowHTML = newRowTr + `
                <td>${name}</td>
                <td>${address}</td>
                <td>${trxBalance}</td>
                <td>${trc20Balance}</td>
            </tr>
        `;
        balanceList.innerHTML += newRowHTML;

        // 延迟 100豪秒后查询下一个钱包
        await sleep(100);
    }
}

// 启动余额查询
getBalances();
