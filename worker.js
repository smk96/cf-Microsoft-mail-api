// KV Namespace 绑定
const API_BASE_URL = 'https://2api.sumo.zone.id/api';
const allowedMailboxes = ['INBOX', 'Junk'];

// Logo URL
const LOGO_URL = 'https://img.xwyue.com/i/2025/01/23/6791c8b24239a.png';

// 主页 HTML 模板
const indexHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>邮箱 API 客户端</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css">
    <link rel="apple-touch-icon" sizes="180x180" href="${LOGO_URL}">
    <link rel="icon" type="image/png" sizes="32x32" href="${LOGO_URL}">
    <link rel="icon" type="image/png" sizes="16x16" href="${LOGO_URL}">
    <link rel="manifest" href="/manifest.json">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="theme-color" content="#ffffff">
    <style>
        :root {
            --bg-color: #f8f9fa;
            --text-color: #212529;
            --accent-color: #0078d4; /* Outlook blue */
            --card-bg: #fff;
            --card-border: #c8c8c8;
            --button-primary: #0078d4; /* Outlook blue */
            --button-primary-hover: #005a9e;
            --button-secondary: #f3f3f3;
            --button-secondary-hover: #e0e0e0;
            --header-bg: #fff;
            --header-border-bottom: #e0e0e0;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --bg-color: #18191a; /* Dark gray background */
                --text-color: #f0f0f0; /* Light gray text */
                --accent-color: #3ab7f0; /* Lighter blue accent */
                --card-bg: #333;
                --card-border: #555;
                --button-primary: #3ab7f0;
                --button-primary-hover: #2a88b8;
                --button-secondary: #444;
                --button-secondary-hover: #555;
                --header-bg: #333;
                --header-border-bottom: #555;
            }
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Outlook font */
            background-color: var(--bg-color);
            color: var(--text-color);
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
        }

        .header {
            background-color: var(--header-bg);
            border-bottom: 1px solid var(--header-border-bottom);
            padding: 15px 0; /* Reduced header padding */
            text-align: center;
            width: 100%;
            margin-bottom: 15px; /* Reduced header margin */
        }

        .container {
            width: 90%;
            max-width: 960px;
        }

        h1 {
            color: var(--accent-color);
            font-size: 1.8rem; /* Slightly smaller header font */
            font-weight: 600; /* More bold */
            margin-bottom: 0.8rem; /* Reduced h1 margin */
        }

        .manage-link {
            text-align: right;
            margin-bottom: 15px; /* Reduced manage link margin */
        }

        .manage-link a {
            color: var(--accent-color);
            text-decoration: none;
            font-size: 0.9rem; /* Smaller manage link font */
        }

        .manage-link a:hover {
            text-decoration: underline;
        }

        .account {
            background-color: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 0.3rem; /* Less rounded cards */
            padding: 1rem; /* Reduced card padding */
            margin-bottom: 0.8rem; /* Reduced account margin */
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* Subtler shadow */
        }

        .account h2 {
            color: var(--text-color);
            font-size: 1.2rem; /* Smaller account h2 font */
            margin-top: 0;
            margin-bottom: 0.8rem; /* Reduced account h2 margin */
            cursor: pointer;
            overflow-wrap: break-word;
            word-break: break-all;
        }

        @media (max-width: 768px) {
            .account h2 {
                font-size: 1rem;
            }
        }

        .account h2:hover {
            text-decoration: underline;
        }

        .actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); /* Slightly narrower buttons */
            gap: 0.8rem; /* Reduced actions gap */
        }

        button {
            padding: 0.6rem 1.2rem; /* Reduced button padding */
            border: 1px solid transparent; /* Outlook style buttons */
            border-radius: 0.3rem; /* Less rounded buttons */
            cursor: pointer;
            font-size: 0.9rem; /* Smaller button font */
            transition: background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; /* Faster transition */
            box-shadow: none; /* Removed default button shadow */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        button:focus {
            outline: 2px solid var(--accent-color); /* Outlook focus style */
            outline-offset: -2px;
            box-shadow: none; /* Remove focus box-shadow if any */
        }


        button.btn-primary {
            background-color: var(--button-primary);
            color: white;
        }

        button.btn-primary:hover {
            background-color: var(--button-primary-hover);
            border-color: var(--button-primary-hover); /* Solid border on hover */
        }

        button.btn-secondary {
            background-color: var(--button-secondary);
            color: var(--text-color); /* Dark text for secondary buttons */
            border: 1px solid var(--card-border); /* Subtle border */
        }

        button.btn-secondary:hover {
            background-color: var(--button-secondary-hover);
            border-color: var(--button-secondary-hover);
        }


        .copy-message {
            margin-top: 0.4rem; /* Reduced copy message margin */
            font-size: 0.8rem; /* Smaller copy message font */
            color: var(--copy-message-color);
            display: none;
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <h1>邮箱 API 客户端</h1>
        </div>
    </header>
    <div class="container">
        <div class="manage-link">
            <a href="/manage" target="_blank">管理账号</a>
            <span id="accountCount"></span>
        </div>
        <div id="accounts"></div>
    </div>
    <script>
        const API_BASE_URL = '${API_BASE_URL}';

        async function loadAccounts() {
            const response = await fetch('/accounts');
            const accounts = await response.json();
            const accountsDiv = document.getElementById('accounts');
            accountsDiv.innerHTML = '';
            
            // 添加账号总数显示
            const accountCount = Object.keys(accounts).length;
            document.getElementById('accountCount').textContent = \` (共 \${accountCount} 个账号)\`;
            
            // 添加带序号的账号
            let index = 1;
            for (const email in accounts) {
                const account = accounts[email];
                const accountDiv = document.createElement('div');
                accountDiv.classList.add('account');
                accountDiv.innerHTML = \`
                    <h2 onclick="copyToClipboard('\${email}', event)" title="点击复制">\${index}. \${email}</h2>
                    <div class="actions">
                        <button class="btn-primary" onclick="openApiUrl('\${email}', 'INBOX', 'new')">获取新邮件 (收件箱)</button>
                        <button class="btn-primary" onclick="openApiUrl('\${email}', 'Junk', 'new')">获取新邮件 (垃圾邮件)</button>
                        <button class="btn-primary" onclick="openApiUrl('\${email}', 'INBOX', 'all')">获取全部邮件 (收件箱)</button>
                        <button class="btn-primary" onclick="openApiUrl('\${email}', 'Junk', 'all')">获取全部邮件 (垃圾邮件)</button>
                        <button class="btn-secondary" onclick="openApiUrl('\${email}', 'INBOX', 'process')">清空收件箱</button>
                        <button class="btn-secondary" onclick="openApiUrl('\${email}', 'Junk', 'process')">清空垃圾邮件</button>
                    </div>
                    <div class="copy-message"></div>
                \`;
                accountsDiv.appendChild(accountDiv);
                index++;
            }
        }

        function openApiUrl(email, mailbox, type) {
            fetch('/accounts').then(response => response.json()).then(accounts => {
                const account = accounts[email];
                if (!account) {
                    alert('账号不存在！');
                    return;
                }
                let url;
                if (type === 'new') {
                    url = \`\${API_BASE_URL}/mail-new?refresh_token=\${account.refresh_token}&client_id=\${account.client_id}&email=\${email}&mailbox=\${mailbox}&response_type=html\`;
                } else if (type === 'all') {
                    url = \`\${API_BASE_URL}/mail-all?refresh_token=\${account.refresh_token}&client_id=\${account.client_id}&email=\${email}&mailbox=\${mailbox}&response_type=html\`;
                } else if (type === 'process') {
                    const apiEndpoint = mailbox === 'INBOX' ? 'process-inbox' : 'process-junk';
                    url = \`\${API_BASE_URL}/\${apiEndpoint}?refresh_token=\${account.refresh_token}&client_id=\${account.client_id}&email=\${email}\`;
                }
                if (url) {
                    window.open(url, '_blank');
                }
            });
        }

        function copyToClipboard(text, event) {
            navigator.clipboard.writeText(text).then(() => {
                const messageDiv = event.target.nextElementSibling.nextElementSibling;
                messageDiv.textContent = '邮箱地址已复制';
                messageDiv.style.display = 'block';
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 2000);
            }, () => {
                const messageDiv = event.target.nextElementSibling.nextElementSibling;
                messageDiv.textContent = '复制失败，请手动复制';
                messageDiv.style.display = 'block';
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 2000);
            });
        }

        loadAccounts();
    </script>
</body>
</html>
`;

// 账号管理页面 HTML 模板
const manageHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>管理账号</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css">
    <link rel="apple-touch-icon" sizes="180x180" href="${LOGO_URL}">
    <link rel="icon" type="image/png" sizes="32x32" href="${LOGO_URL}">
    <link rel="icon" type="image/png" sizes="16x16" href="${LOGO_URL}">
    <link rel="manifest" href="/manifest.json">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="theme-color" content="#ffffff">
    <style>
        :root {
            --bg-color: #f8f9fa;
            --text-color: #212529;
            --accent-color: #0078d4; /* Outlook blue */
            --card-bg: #fff;
            --card-border: #c8c8c8;
            --button-primary: #0078d4; /* Outlook blue */
            --button-primary-hover: #005a9e;
            --delete-button-bg: #dc3545;
            --delete-button-hover: #c82333;
            --header-bg: #fff;
            --header-border-bottom: #e0e0e0;
            --form-label-color: #495057;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --bg-color: #18191a; /* Dark gray background */
                --text-color: #f0f0f0; /* Light gray text */
                --accent-color: #3ab7f0; /* Lighter blue accent */
                --card-bg: #333;
                --card-border: #555;
                --button-primary: #3ab7f0;
                --button-primary-hover: #2a88b8;
                --delete-button-bg: #c82333;
                --delete-button-hover: #b01a28;
                --header-bg: #333;
                --header-border-bottom: #555;
                --form-label-color: #bbb;
            }
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Outlook font */
            background-color: var(--bg-color);
            color: var(--text-color);
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-height: 100vh;
        }

        .header {
            background-color: var(--header-bg);
            border-bottom: 1px solid var(--header-border-bottom);
            padding: 15px 0; /* Reduced header padding */
            text-align: center;
            width: 100%;
            margin-bottom: 15px; /* Reduced header margin */
        }


        .container {
            width: 90%;
            max-width: 700px;
        }

        h1 {
            color: var(--accent-color);
            font-size: 1.8rem; /* Slightly smaller header font */
            font-weight: 600; /* More bold */
            margin-bottom: 0.8rem; /* Reduced h1 margin */
        }

        .back-link {
            text-align: right;
            margin-bottom: 1.5rem; /* Reduced back link margin */
        }

        .back-link a {
            color: var (--accent-color);
            text-decoration: none;
            font-size: 0.9rem; /* Smaller back link font */
        }

        .back-link a:hover {
            text-decoration: underline;
        }

        .import-area {
            margin-bottom: 1.5rem; /* Reduced import area margin */
        }

        .import-area h2, .add-account-form h2 {
            font-size: 1.4rem; /* Smaller form heading font */
            color: var(--text-color);
            margin-top: 0;
            margin-bottom: 1rem; /* Reduced form heading margin */
        }

        .import-area label, .add-account-form label {
            display: block;
            margin-bottom: 0.4rem; /* Reduced label margin */
            font-size: 0.9rem; /* Smaller label font */
            color: var(--form-label-color);
        }

        .import-area input, .import-area textarea, .add-account-form input, .add-account-form textarea { /* Unified input styling */
            width: calc(100% - 1.6rem); /* Adjusted width */
            padding: 0.6rem 0.8rem; /* Reduced input padding */
            margin-bottom: 0.8rem; /* Reduced input margin */
            border: 1px solid var(--card-border);
            border-radius: 0.3rem; /* Less rounded inputs */
            font-size: 0.9rem; /* Smaller input font */
            background-color: var(--card-bg);
            color: var(--text-color);
        }


        .add-account-form button, .import-area button {
            padding: 0.6rem 1.2rem; /* Reduced form button padding */
            border: 1px solid transparent; /* Outlook style buttons */
            border-radius: 0.3rem; /* Less rounded buttons */
            cursor: pointer;
            font-size: 0.9rem; /* Smaller form button font */
            transition: background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; /* Faster transition */
            box-shadow: none; /* Removed default button shadow */
            background-color: var(--button-primary);
            color: white;
            width: 100%;
            box-sizing: border-box;
        }

        .add-account-form button:hover, .import-area button:hover {
            background-color: var(--button-primary-hover);
            border-color: var(--button-primary-hover); /* Solid border on hover */
        }


        .account {
            background-color: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 0.3rem; /* Less rounded accounts */
            padding: 1rem; /* Reduced account padding */
            margin-bottom: 0.8rem; /* Reduced account margin */
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* Subtler shadow */
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .account h2 {
            color: var(--text-color);
            margin-top: 0;
            margin-bottom: 0;
            font-size: 1.1rem; /* Smaller account email font */
            margin-right: 1rem; /* Reduced spacing */
            cursor: pointer;
        }

         /* 手机端调整账号管理页邮箱字号 */
        @media (max-width: 768px) {
            .account h2 {
                font-size: 0.9rem; /* Even smaller on mobile */
            }
        }

        .account h2:hover {
            text-decoration: underline;
        }

        .account .actions button {
            padding: 0.4rem 0.8rem; /* Even smaller delete button */
            border: none;
            border-radius: 0.3rem; /* Less rounded delete button */
            cursor: pointer;
            font-size: 0.8rem; /* Even smaller delete button font */
            transition: background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; /* Faster transition */
            box-shadow: none; /* Removed default delete button shadow */
            background-color: var(--delete-button-bg);
            color: white;
            min-width: auto;
            width: auto;
        }

        .account .actions button:hover {
            background-color: var(--delete-button-hover);
            box-shadow: none; /* Removed hover shadow for delete button */
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="container">
            <h1>管理账号</h1>
        </div>
    </header>
    <div class="container">
        <div class="back-link">
            <a href="/">返回邮箱 API 客户端</a>
        </div>
        <div class="import-area">
            <h2>账号导入</h2>
            <label for="delimiter">分隔符:</label>
            <input type="text" id="delimiter" placeholder="默认为 ----">
            <textarea id="importText" placeholder="粘贴导入字符串，每行一个账号，例如：email----password----clientId----refreshToken&#10;支持批量导入，每个账号占一行" rows="6"></textarea>
            <button onclick="importAccount()" class="btn-primary">导入账号</button>
        </div>
        <div class="add-account-form">
            <h2>添加账号</h2>
            <form id="addAccountForm">
                <label for="email">邮箱:</label>
                <input type="email" id="email" name="email" required>
                <label for="refresh_token">Refresh Token:</label>
                <input type="text" id="refresh_token" name="refresh_token" required>
                <label for="client_id">Client ID:</label>
                <input type="text" id="client_id" name="client_id" required>
                <button type="submit">添加账号</button>
            </form>
        </div>
        <div id="accounts"></div>
    </div>
    <script>
        async function loadAccounts() {
            const response = await fetch('/accounts');
            const accounts = await response.json();
            const accountsDiv = document.getElementById('accounts');
            accountsDiv.innerHTML = '';

            for (const email in accounts) {
                const account = accounts[email];
                const accountDiv = document.createElement('div');
                accountDiv.classList.add('account');
                accountDiv.innerHTML = \`
                    <h2>\${email}</h2>
                    <div class="actions">
                        <button class="btn-danger" onclick="deleteAccount(event, '\${email}')">删除</button>
                    </div>
                \`;
                accountsDiv.appendChild(accountDiv);
            }
        }

        async function deleteAccount(event, email) {
            event.preventDefault();
            if (!confirm('确定要删除账号 ' + email + ' 吗？')) {
                return;
            }

            try {
                const response = await fetch('/manage?email=' + email, { method: 'DELETE' });
                if (response.ok) {
                    alert('账号已删除');
                    loadAccounts();
                } else {
                    const error = await response.text();
                    alert('错误: ' + error);
                }
            } catch (error) {
                alert('错误: ' + error.message);
            }
        }

        document.getElementById('addAccountForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const email = formData.get('email');
            const refresh_token = formData.get('refresh_token');
            const client_id = formData.get('client_id');

            try {
                const response = await fetch('/manage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        refresh_token: refresh_token,
                        client_id: client_id
                    })
                });

                if (response.ok) {
                    alert('账号添加成功');
                    loadAccounts();
                    event.target.reset();
                } else {
                    const error = await response.text();
                    alert('错误: ' + error);
                }
            } catch (error) {
                alert('错误: ' + error.message);
            }
        });

        function importAccount() {
            const importText = document.getElementById('importText').value;
            const delimiter = document.getElementById('delimiter').value || '----';
            
            // 分割每一行作为单独的账号
            const lines = importText.trim().split('\\n').filter(line => line.trim() !== '');
            
            if (lines.length === 0) {
                alert('请输入有效的账号信息');
                return;
            }
            
            if (lines.length === 1) {
                // 单个账号导入
                processSingleAccount(lines[0], delimiter);
            } else {
                // 批量导入
                processMultipleAccounts(lines, delimiter);
            }
        }
        
        function processSingleAccount(accountStr, delimiter) {
            const parts = accountStr.split(delimiter);
            
            if (parts.length >= 4) {
                const email = parts[0];
                const clientId = parts[2];
                const refreshToken = parts[3];

                document.getElementById('email').value = email;
                document.getElementById('client_id').value = clientId;
                document.getElementById('refresh_token').value = refreshToken;
                alert('账号信息已填充到表单，请点击"添加账号"按钮提交。');
            } else {
                alert('导入格式不正确，请检查示例格式和分隔符设置。');
            }
        }
        
        async function processMultipleAccounts(accountLines, delimiter) {
            let successCount = 0;
            let failCount = 0;
            let errors = [];
            const totalAccounts = accountLines.length;
            
            // 创建导入状态元素
            const statusDiv = document.createElement('div');
            statusDiv.style.marginTop = '10px';
            statusDiv.style.padding = '10px';
            statusDiv.style.backgroundColor = 'var(--card-bg)';
            statusDiv.style.border = '1px solid var(--card-border)';
            statusDiv.style.borderRadius = '0.3rem';
            statusDiv.innerHTML = "<p>正在导入 " + totalAccounts + " 个账号...</p>";
            document.querySelector('.import-area').appendChild(statusDiv);
            
            // 创建所有导入任务的数组
            const importTasks = accountLines.map(async (line, index) => {
                const parts = line.split(delimiter);
                
                if (parts.length >= 4) {
                    const email = parts[0].trim();
                    const clientId = parts[2].trim();
                    const refreshToken = parts[3].trim();
                    
                    try {
                        const response = await fetch('/manage', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                email: email,
                                refresh_token: refreshToken,
                                client_id: clientId
                            })
                        });
                        
                        if (response.ok) {
                            return { success: true, email, index };
                        } else {
                            const error = await response.text();
                            return { success: false, email, error, index };
                        }
                    } catch (error) {
                        return { success: false, email, error: error.message, index };
                    }
                } else {
                    return { success: false, error: '格式错误', line, index };
                }
            });
            
            // 并行处理所有导入任务
            const results = await Promise.all(importTasks);
            
            // 处理结果
            for (const result of results) {
                if (result.success) {
                    successCount++;
                } else {
                    failCount++;
                    errors.push("#" + (result.index + 1) + " " + (result.email || result.line) + ": " + result.error);

                }
            }
            
            if (successCount > 0) {
                loadAccounts(); // 重新加载账号列表
            }
            
            // 移除状态元素
            document.querySelector('.import-area').removeChild(statusDiv);
            
            let message = \`导入完成：共 \${totalAccounts} 个账号\\n\`;
            message += \`✅ 成功: \${successCount} 个\\n\`;
            if (failCount > 0) {
                message += \`❌ 失败: \${failCount} 个\\n\\n\`;
                message += errors.join('\\n');
            }
            
            alert(message);
        }

        loadAccounts();
    </script>
</body>
</html>
`;

async function handleRequest(request) {
    const url = new URL(request.url);

    // 主页路由
    if (url.pathname === '/' && request.method === 'GET') {
        return new Response(indexHTML, {
            headers: { 'Content-Type': 'text/html' },
        });
    }

    // 账号管理页面路由
    if (url.pathname === '/manage' && request.method === 'GET') {
        return new Response(manageHTML, {
            headers: { 'Content-Type': 'text/html' },
        });
    }

    // 获取账号列表的路由
    if (url.pathname === '/accounts' && request.method === 'GET') {
        try {
            const keys = await ACCOUNTS.list();
            const accounts = {};
            for (const key of keys.keys) {
                const account = await ACCOUNTS.get(key.name, 'json');
                accounts[key.name] = account;
            }
            return new Response(JSON.stringify(accounts), {
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            return new Response('Error fetching accounts: ' + error.message, { status: 500 });
        }
    }

    // 添加账号的路由
    if (url.pathname === '/manage' && request.method === 'POST') {
        try {
            const body = await request.json();
            const { email, refresh_token, client_id } = body;

            if (!email || !refresh_token || !client_id) {
                return new Response('Missing required fields', { status: 400 });
            }

            await ACCOUNTS.put(email, JSON.stringify({ refresh_token, client_id }));
            return new Response('Account added', { status: 200 });
        } catch (error) {
            return new Response('Error adding account: ' + error.message, { status: 500 });
        }
    }

    // 删除账号的路由
    if (url.pathname === '/manage' && request.method === 'DELETE') {
        try {
            const email = url.searchParams.get('email');
            if (!email) {
                return new Response('Email is required', { status: 400 });
            }

            await ACCOUNTS.delete(email);
            return new Response('Account deleted', { status: 200 });
        } catch (error) {
            return new Response('Error deleting account: ' + error.message, { status: 500 });
        }
    }
    // 其他API请求直接返回错误，因为现在通过直接拼接 URL 访问
    if (url.pathname.startsWith('/api/')) {
        return new Response('API access through this worker is now deprecated. Please use the direct URL method.', { status: 400 });
    }

    // 404 路由
    return new Response('Not Found', { status: 404 });
}

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});
