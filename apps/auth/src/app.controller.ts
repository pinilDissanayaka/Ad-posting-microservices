import { Controller, Get, Header, Res } from '@nestjs/common'
import { Response } from 'express'
import { Auth } from '@lib/common'

@Controller()
export class AppController {
  @Get()
  @Auth({ isOpen: true })
  @Header('Content-Type', 'text/html; charset=utf-8')
  getApiDashboard(@Res() res: Response) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ad Posting Microservices - API Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        .header {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        h1 {
            color: #667eea;
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            font-size: 1.1em;
        }
        .services-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(600px, 1fr));
            gap: 30px;
            margin-bottom: 30px;
        }
        .service-card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .service-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #f0f0f0;
        }
        .service-title {
            font-size: 1.8em;
            color: #333;
            font-weight: 600;
        }
        .service-url {
            background: #667eea;
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9em;
            font-weight: 500;
        }
        .endpoint {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin-bottom: 15px;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        .endpoint:hover {
            background: #e9ecef;
            transform: translateX(5px);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .method {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.85em;
            margin-right: 10px;
        }
        .method-post { background: #28a745; color: white; }
        .method-get { background: #17a2b8; color: white; }
        .method-put { background: #ffc107; color: #333; }
        .method-delete { background: #dc3545; color: white; }
        .endpoint-path {
            font-family: 'Courier New', monospace;
            font-weight: 600;
            color: #333;
            margin-right: 10px;
        }
        .endpoint-desc {
            color: #666;
            font-size: 0.95em;
            margin-top: 8px;
            display: block;
        }
        .test-btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9em;
            font-weight: 500;
            margin-top: 8px;
            transition: all 0.3s ease;
        }
        .test-btn:hover {
            background: #5568d3;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        .links-section {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
        }
        .links-title {
            font-size: 1.5em;
            color: #333;
            margin-bottom: 20px;
        }
        .swagger-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }
        .swagger-link {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-block;
        }
        .swagger-link:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: 600;
            background: #28a745;
            color: white;
            margin-left: 10px;
        }
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        .modal.active { display: flex; }
        .modal-content {
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        .close-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
        }
        textarea, input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            margin-bottom: 15px;
        }
        textarea { min-height: 150px; resize: vertical; }
        .send-btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            font-size: 1em;
            width: 100%;
        }
        .send-btn:hover { background: #218838; }
        .response-box {
            background: #f8f9fa;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            white-space: pre-wrap;
            max-height: 300px;
            overflow-y: auto;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Ad Posting Microservices</h1>
            <p class="subtitle">API Dashboard & Testing Interface</p>
        </div>

        <div class="services-grid">
            <!-- Auth Service -->
            <div class="service-card">
                <div class="service-header">
                    <div>
                        <div class="service-title">Auth Service<span class="status-badge">RUNNING</span></div>
                    </div>
                    <div class="service-url">:8080</div>
                </div>

                <div class="endpoint">
                    <span class="method method-post">POST</span>
                    <span class="endpoint-path">/auth/register/user</span>
                    <span class="endpoint-desc">Register a new user</span>
                    <button class="test-btn" onclick='testEndpoint("POST", "http://localhost:8080/auth/register/user", {firstName: "John", lastName: "Doe", email: "john@example.com", password: "password123", phone: "1234567890", role: "tenant"})'>Test</button>
                </div>

                <div class="endpoint">
                    <span class="method method-post">POST</span>
                    <span class="endpoint-path">/auth/login/user</span>
                    <span class="endpoint-desc">Login as user</span>
                    <button class="test-btn" onclick='testEndpoint("POST", "http://localhost:8080/auth/login/user", {email: "john@example.com", password: "password123"})'>Test</button>
                </div>

                <div class="endpoint">
                    <span class="method method-get">GET</span>
                    <span class="endpoint-path">/auth/me</span>
                    <span class="endpoint-desc">Get current authenticated user (requires auth)</span>
                    <button class="test-btn" onclick='testEndpoint("GET", "http://localhost:8080/auth/me")'>Test</button>
                </div>
            </div>

            <!-- Listings Service -->
            <div class="service-card">
                <div class="service-header">
                    <div>
                        <div class="service-title">Listings Service<span class="status-badge">RUNNING</span></div>
                    </div>
                    <div class="service-url">:8081</div>
                </div>

                <div class="endpoint">
                    <span class="method method-get">GET</span>
                    <span class="endpoint-path">/listings</span>
                    <span class="endpoint-desc">Get all listings with optional filters</span>
                    <button class="test-btn" onclick='testEndpoint("GET", "http://localhost:8081/listings?sortBy=createdAt&page=1&limit=10")'>Test</button>
                </div>

                <div class="endpoint">
                    <span class="method method-post">POST</span>
                    <span class="endpoint-path">/listings</span>
                    <span class="endpoint-desc">Create new property listing (requires auth)</span>
                    <button class="test-btn" onclick='testEndpoint("POST", "http://localhost:8081/listings", {title: "Beautiful Apartment", description: "Spacious 2BHK", propertyType: "apartment", location: {district: "Downtown", city: "NYC"}, rentPerMonth: 2000, deposit: 4000, bedrooms: 2, bathrooms: 2, furnishing: "furnished", amenities: ["WiFi", "Parking"], images: [], contactPhone: "1234567890"})'>Test</button>
                </div>

                <div class="endpoint">
                    <span class="method method-get">GET</span>
                    <span class="endpoint-path">/listings/my-listings</span>
                    <span class="endpoint-desc">Get current user's listings (requires auth)</span>
                    <button class="test-btn" onclick='testEndpoint("GET", "http://localhost:8081/listings/my-listings")'>Test</button>
                </div>

                <div class="endpoint">
                    <span class="method method-get">GET</span>
                    <span class="endpoint-path">/listings/:id</span>
                    <span class="endpoint-desc">Get single listing by ID</span>
                    <button class="test-btn" onclick='alert("Replace :id with actual listing ID in the URL")'>Test</button>
                </div>
            </div>
        </div>

        <div class="links-section">
            <div class="links-title">📚 Interactive API Documentation</div>
            <div class="swagger-links">
                <a href="http://localhost:8080/api" target="_blank" class="swagger-link">
                    Auth Service Swagger →
                </a>
                <a href="http://localhost:8081/api" target="_blank" class="swagger-link">
                    Listings Service Swagger →
                </a>
            </div>
        </div>
    </div>

    <!-- Test Modal -->
    <div id="testModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modalTitle">Test API</h2>
                <button class="close-btn" onclick="closeModal()">Close</button>
            </div>
            <div>
                <label><strong>URL:</strong></label>
                <input type="text" id="testUrl" readonly>

                <label><strong>Method:</strong></label>
                <input type="text" id="testMethod" readonly>

                <label><strong>Authorization Token (optional):</strong></label>
                <input type="text" id="authToken" placeholder="Bearer token...">

                <label><strong>Request Body:</strong></label>
                <textarea id="testBody"></textarea>

                <button class="send-btn" onclick="sendRequest()">Send Request</button>

                <div id="response" class="response-box" style="display:none;"></div>
            </div>
        </div>
    </div>

    <script>
        let currentRequest = {};

        function testEndpoint(method, url, body = null) {
            currentRequest = { method, url, body };
            document.getElementById('modalTitle').textContent = method + ' ' + url.split('localhost:')[1];
            document.getElementById('testUrl').value = url;
            document.getElementById('testMethod').value = method;
            document.getElementById('testBody').value = body ? JSON.stringify(body, null, 2) : '';
            document.getElementById('response').style.display = 'none';
            document.getElementById('testModal').classList.add('active');
        }

        function closeModal() {
            document.getElementById('testModal').classList.remove('active');
        }

        async function sendRequest() {
            const url = document.getElementById('testUrl').value;
            const method = document.getElementById('testMethod').value;
            const token = document.getElementById('authToken').value;
            const bodyText = document.getElementById('testBody').value;
            const responseBox = document.getElementById('response');

            try {
                const options = {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                };

                if (token) {
                    options.headers['Authorization'] = token.startsWith('Bearer ') ? token : 'Bearer ' + token;
                }

                if (method !== 'GET' && bodyText) {
                    options.body = bodyText;
                }

                responseBox.textContent = 'Sending request...';
                responseBox.style.display = 'block';

                const response = await fetch(url, options);
                const data = await response.json();

                responseBox.textContent = 'Status: ' + response.status + '\\n\\n' + JSON.stringify(data, null, 2);

                // Save token if login successful
                if (data.success && data.data && data.data.token) {
                    document.getElementById('authToken').value = 'Bearer ' + data.data.token;
                    alert('Token saved! You can now test authenticated endpoints.');
                }
            } catch (error) {
                responseBox.textContent = 'Error: ' + error.message;
            }
        }

        // Close modal on background click
        document.getElementById('testModal').addEventListener('click', (e) => {
            if (e.target.id === 'testModal') closeModal();
        });
    </script>
</body>
</html>
    `;
    res.send(html);
  }
}
