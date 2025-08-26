import { Project, Agent } from './types';

export interface AppPreviewConfig {
  appType: string;
  features: string[];
  hasAuth: boolean;
  hasDashboard: boolean;
  hasRealtime: boolean;
  hasPayments: boolean;
  hasChat: boolean;
  hasCalendar: boolean;
  hasAnalytics: boolean;
  colorScheme: string;
  complexity: 'simple' | 'moderate' | 'advanced' | 'enterprise';
}

export class PreviewGenerator {
  static analyzeProject(project: Project): AppPreviewConfig {
    const description = project.description.toLowerCase();
    const agentOutputs = project.agents.reduce((acc, agent) => {
      if (agent.output) acc[agent.id] = agent.output;
      return acc;
    }, {} as Record<string, any>);

    return {
      appType: this.detectAppType(description),
      features: this.extractFeatures(description, agentOutputs),
      hasAuth: this.hasFeature(description, ['login', 'auth', 'sign', 'user', 'account']),
      hasDashboard: this.hasFeature(description, ['dashboard', 'admin', 'panel', 'overview']),
      hasRealtime: this.hasFeature(description, ['real-time', 'live', 'chat', 'notification']),
      hasPayments: this.hasFeature(description, ['payment', 'billing', 'subscription', 'checkout']),
      hasChat: this.hasFeature(description, ['chat', 'message', 'communication']),
      hasCalendar: this.hasFeature(description, ['calendar', 'schedule', 'appointment', 'booking']),
      hasAnalytics: this.hasFeature(description, ['analytics', 'metrics', 'stats', 'report']),
      colorScheme: this.detectColorScheme(description),
      complexity: this.detectComplexity(description, agentOutputs)
    };
  }

  static generatePreviewHTML(project: Project, config: AppPreviewConfig): string {
    const components = {
      calculator: this.generateCalculatorApp(project, config),
      ecommerce: this.generateEcommerceApp(project, config),
      social: this.generateSocialApp(project, config),
      dashboard: this.generateDashboardApp(project, config),
      blog: this.generateBlogApp(project, config),
      portfolio: this.generatePortfolioApp(project, config),
      default: this.generateDefaultApp(project, config)
    };

    const appComponent = components[config.appType as keyof typeof components] || components.default;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${project.name}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        ${this.generateCustomStyles(config)}
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        ${this.generateReactHooks(config)}
        ${appComponent}
        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>`;
  }

  private static detectAppType(description: string): string {
    const types = {
      calculator: ['calculator', 'calc', 'math', 'arithmetic'],
      ecommerce: ['shop', 'store', 'ecommerce', 'e-commerce', 'product', 'cart'],
      social: ['social', 'media', 'post', 'feed', 'follow', 'like'],
      blog: ['blog', 'article', 'content', 'cms', 'publish'],
      portfolio: ['portfolio', 'showcase', 'gallery', 'work'],
      dashboard: ['dashboard', 'admin', 'analytics', 'metrics']
    };

    for (const [type, keywords] of Object.entries(types)) {
      if (keywords.some(keyword => description.includes(keyword))) {
        return type;
      }
    }
    return 'default';
  }

  private static hasFeature(description: string, keywords: string[]): boolean {
    return keywords.some(keyword => description.includes(keyword));
  }

  private static extractFeatures(description: string, agentOutputs: any): string[] {
    const features = [];
    
    // Extract from description
    if (this.hasFeature(description, ['auth', 'login'])) features.push('Authentication');
    if (this.hasFeature(description, ['dark', 'theme'])) features.push('Dark Mode');
    if (this.hasFeature(description, ['responsive'])) features.push('Responsive Design');
    if (this.hasFeature(description, ['real-time', 'live'])) features.push('Real-time Updates');
    
    // Extract from agent outputs
    if (agentOutputs['ui-ux']?.components) {
      features.push('Modern UI Components');
    }
    if (agentOutputs.backend?.endpoints) {
      features.push('REST API');
    }
    if (agentOutputs.database?.schema) {
      features.push('Database Integration');
    }
    
    return features;
  }

  private static detectColorScheme(description: string): string {
    if (description.includes('blue')) return 'blue';
    if (description.includes('green')) return 'green';
    if (description.includes('purple')) return 'purple';
    if (description.includes('red')) return 'red';
    return 'blue'; // default
  }

  private static detectComplexity(description: string, agentOutputs: any): 'simple' | 'moderate' | 'advanced' | 'enterprise' {
    let score = 0;
    
    // Feature complexity
    if (this.hasFeature(description, ['auth', 'login'])) score += 1;
    if (this.hasFeature(description, ['real-time', 'live'])) score += 2;
    if (this.hasFeature(description, ['payment', 'billing'])) score += 2;
    if (this.hasFeature(description, ['admin', 'dashboard'])) score += 1;
    
    // Agent output complexity
    if (agentOutputs.backend?.endpoints?.length > 5) score += 1;
    if (agentOutputs.database?.schema?.tables?.length > 3) score += 1;
    
    if (score >= 6) return 'enterprise';
    if (score >= 4) return 'advanced';
    if (score >= 2) return 'moderate';
    return 'simple';
  }

  private static generateCustomStyles(config: AppPreviewConfig): string {
    return `
        .gradient-bg { background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%); }
        .glass { backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.1); }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        :root {
            --primary-color: ${this.getColorValue(config.colorScheme, 500)};
            --secondary-color: ${this.getColorValue(config.colorScheme, 600)};
        }
    `;
  }

  private static getColorValue(color: string, shade: number): string {
    const colors = {
      blue: { 500: '#3b82f6', 600: '#2563eb' },
      green: { 500: '#10b981', 600: '#059669' },
      purple: { 500: '#8b5cf6', 600: '#7c3aed' },
      red: { 500: '#ef4444', 600: '#dc2626' }
    };
    return colors[color as keyof typeof colors]?.[shade as keyof typeof colors.blue] || colors.blue[shade as keyof typeof colors.blue];
  }

  private static generateReactHooks(config: AppPreviewConfig): string {
    return `
        const { useState, useEffect } = React;
        
        const useAuth = () => {
          const [user, setUser] = useState(${config.hasAuth ? 'null' : '{ id: 1, name: "Demo User" }'});
          const [loading, setLoading] = useState(false);
          
          const login = async (email, password) => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setUser({ id: 1, name: email.split('@')[0], email });
            setLoading(false);
          };
          
          return { user, login, logout: () => setUser(null), loading };
        };
        
        const useRealTime = () => {
          const [data, setData] = useState([]);
          
          useEffect(() => {
            if (!${config.hasRealtime}) return;
            
            const interval = setInterval(() => {
              setData(prev => [...prev.slice(-4), {
                id: Date.now(),
                value: Math.floor(Math.random() * 100),
                timestamp: new Date().toLocaleTimeString()
              }]);
            }, 3000);
            
            return () => clearInterval(interval);
          }, []);
          
          return data;
        };
    `;
  }

  private static generateCalculatorApp(project: Project, config: AppPreviewConfig): string {
    return `
        function App() {
          const [display, setDisplay] = useState('0');
          const [previousValue, setPreviousValue] = useState(null);
          const [operation, setOperation] = useState(null);
          const [waitingForOperand, setWaitingForOperand] = useState(false);
          const [history, setHistory] = useState([]);

          const inputNumber = (num) => {
            if (waitingForOperand) {
              setDisplay(String(num));
              setWaitingForOperand(false);
            } else {
              setDisplay(display === '0' ? String(num) : display + num);
            }
          };

          const inputOperation = (nextOperation) => {
            const inputValue = parseFloat(display);

            if (previousValue === null) {
              setPreviousValue(inputValue);
            } else if (operation) {
              const currentValue = previousValue || 0;
              const newValue = calculate(currentValue, inputValue, operation);

              setDisplay(String(newValue));
              setPreviousValue(newValue);
              
              setHistory(prev => [...prev, \`\${currentValue} \${operation} \${inputValue} = \${newValue}\`]);
            }

            setWaitingForOperand(true);
            setOperation(nextOperation);
          };

          const calculate = (firstValue, secondValue, operation) => {
            switch (operation) {
              case '+': return firstValue + secondValue;
              case '-': return firstValue - secondValue;
              case '×': return firstValue * secondValue;
              case '÷': return firstValue / secondValue;
              case '=': return secondValue;
              default: return secondValue;
            }
          };

          const clear = () => {
            setDisplay('0');
            setPreviousValue(null);
            setOperation(null);
            setWaitingForOperand(false);
          };

          const Button = ({ onClick, className = '', children, ...props }) => (
            <button
              onClick={onClick}
              className={\`h-16 text-xl font-semibold rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 \${className}\`}
              {...props}
            >
              {children}
            </button>
          );

          return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">${project.name}</h1>
                  <div className="bg-gray-100 rounded-lg p-4 text-right">
                    <div className="text-3xl font-mono text-gray-800 break-all">{display}</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-4">
                  <Button onClick={clear} className="col-span-2 bg-red-500 hover:bg-red-600 text-white">Clear</Button>
                  <Button onClick={() => inputOperation('÷')} className="bg-orange-500 hover:bg-orange-600 text-white">÷</Button>
                  <Button onClick={() => inputOperation('×')} className="bg-orange-500 hover:bg-orange-600 text-white">×</Button>

                  <Button onClick={() => inputNumber(7)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">7</Button>
                  <Button onClick={() => inputNumber(8)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">8</Button>
                  <Button onClick={() => inputNumber(9)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">9</Button>
                  <Button onClick={() => inputOperation('-')} className="bg-orange-500 hover:bg-orange-600 text-white">-</Button>

                  <Button onClick={() => inputNumber(4)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">4</Button>
                  <Button onClick={() => inputNumber(5)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">5</Button>
                  <Button onClick={() => inputNumber(6)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">6</Button>
                  <Button onClick={() => inputOperation('+')} className="bg-orange-500 hover:bg-orange-600 text-white">+</Button>

                  <Button onClick={() => inputNumber(1)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">1</Button>
                  <Button onClick={() => inputNumber(2)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">2</Button>
                  <Button onClick={() => inputNumber(3)} className="bg-gray-200 hover:bg-gray-300 text-gray-800">3</Button>
                  <Button onClick={() => inputOperation('=')} className="row-span-2 bg-blue-500 hover:bg-blue-600 text-white">=</Button>

                  <Button onClick={() => inputNumber(0)} className="col-span-2 bg-gray-200 hover:bg-gray-300 text-gray-800">0</Button>
                  <Button onClick={() => setDisplay(display.includes('.') ? display : display + '.')} className="bg-gray-200 hover:bg-gray-300 text-gray-800">.</Button>
                </div>

                {history.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">History</h3>
                    {history.slice(-3).map((calc, index) => (
                      <div key={index} className="text-xs text-gray-500 font-mono">{calc}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        }
    `;
  }

  private static generateEcommerceApp(project: Project, config: AppPreviewConfig): string {
    return `
        function App() {
          const { user, login } = useAuth();
          const [products] = useState([
            { id: 1, name: 'Premium Headphones', price: 299, image: '🎧', rating: 4.8 },
            { id: 2, name: 'Smart Watch', price: 399, image: '⌚', rating: 4.6 },
            { id: 3, name: 'Wireless Speaker', price: 199, image: '🔊', rating: 4.9 },
            { id: 4, name: 'Gaming Mouse', price: 79, image: '🖱️', rating: 4.7 }
          ]);
          const [cart, setCart] = useState([]);

          const addToCart = (product) => {
            setCart(prev => [...prev, product]);
          };

          return (
            <div className="min-h-screen bg-gray-50">
              <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <h1 className="text-xl font-bold text-${config.colorScheme}-600">${project.name}</h1>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <span className="text-2xl">🛒</span>
                        {cart.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {cart.length}
                          </span>
                        )}
                      </div>
                      ${config.hasAuth ? `
                      {user ? (
                        <span className="text-sm">Hi, {user.name}!</span>
                      ) : (
                        <button onClick={() => login('demo@shop.com', 'password')} className="bg-${config.colorScheme}-500 text-white px-4 py-2 rounded">
                          Sign In
                        </button>
                      )}` : ''}
                    </div>
                  </div>
                </div>
              </nav>

              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
                  <p className="text-gray-600">Discover our premium collection</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="p-6 text-center">
                        <div className="text-6xl mb-4">{product.image}</div>
                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                        <div className="flex items-center justify-center mb-2">
                          <span className="text-yellow-400">{'★'.repeat(Math.floor(product.rating))}</span>
                          <span className="text-gray-400 text-sm ml-1">({product.rating})</span>
                        </div>
                        <p className="text-2xl font-bold text-${config.colorScheme}-600 mb-4">\${product.price}</p>
                        <button
                          onClick={() => addToCart(product)}
                          className="w-full bg-${config.colorScheme}-500 hover:bg-${config.colorScheme}-600 text-white py-2 rounded-lg transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {cart.length > 0 && (
                  <div className="mt-12 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold mb-4">Shopping Cart ({cart.length} items)</h3>
                    <div className="space-y-2">
                      {cart.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b">
                          <span>{item.name}</span>
                          <span className="font-semibold">\${item.price}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-4 text-xl font-bold">
                        <span>Total:</span>
                        <span>\${cart.reduce((sum, item) => sum + item.price, 0)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </main>
            </div>
          );
        }
    `;
  }

  private static generateDashboardApp(project: Project, config: AppPreviewConfig): string {
    return `
        function App() {
          const { user, login } = useAuth();
          const realTimeData = useRealTime();
          const [stats, setStats] = useState({});

          useEffect(() => {
            setStats({
              users: Math.floor(Math.random() * 10000) + 5000,
              revenue: Math.floor(Math.random() * 100000) + 50000,
              orders: Math.floor(Math.random() * 1000) + 500,
              growth: Math.floor(Math.random() * 20) + 5
            });
          }, []);

          if (!user) {
            return (
              <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                  <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
                  <button
                    onClick={() => login('admin@${project.name.toLowerCase()}.com', 'admin')}
                    className="w-full bg-${config.colorScheme}-500 hover:bg-${config.colorScheme}-600 text-white py-3 rounded-lg"
                  >
                    Sign In as Admin
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div className="min-h-screen bg-gray-100">
              <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <h1 className="text-xl font-bold">${project.name} Dashboard</h1>
                    <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                  </div>
                </div>
              </nav>

              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">👥</div>
                      <div>
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold">{stats.users?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">💰</div>
                      <div>
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-2xl font-bold">\${stats.revenue?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">📦</div>
                      <div>
                        <p className="text-sm text-gray-600">Orders</p>
                        <p className="text-2xl font-bold">{stats.orders?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center">
                      <div className="text-3xl mr-4">📈</div>
                      <div>
                        <p className="text-sm text-gray-600">Growth</p>
                        <p className="text-2xl font-bold">{stats.growth}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                ${config.hasRealtime ? `
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Real-time Activity
                  </h3>
                  <div className="space-y-2">
                    {realTimeData.slice(-5).map(item => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span>Activity detected</span>
                        <span className="text-sm text-gray-500">{item.timestamp}</span>
                      </div>
                    ))}
                  </div>
                </div>` : ''}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      {['New user registered', 'Order completed', 'Payment received', 'Report generated'].map((activity, index) => (
                        <div key={index} className="flex items-center p-3 bg-gray-50 rounded">
                          <div className="w-2 h-2 bg-${config.colorScheme}-500 rounded-full mr-3"></div>
                          <span>{activity}</span>
                          <span className="ml-auto text-sm text-gray-500">{Math.floor(Math.random() * 60)} min ago</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Performance</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Server Load</span>
                          <span>23%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '23%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Memory Usage</span>
                          <span>67%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '67%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          );
        }
    `;
  }

  private static generateDefaultApp(project: Project, config: AppPreviewConfig): string {
    return `
        function App() {
          const { user, login } = useAuth();
          const [darkMode, setDarkMode] = useState(false);

          return (
            <div className={\`min-h-screen transition-colors \${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}\`}>
              <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <h1 className="text-xl font-bold text-${config.colorScheme}-600">${project.name}</h1>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        {darkMode ? '☀️' : '🌙'}
                      </button>
                      ${config.hasAuth ? `
                      {user ? (
                        <span className="text-sm">Hi, {user.name}!</span>
                      ) : (
                        <button onClick={() => login('demo@app.com', 'password')} className="bg-${config.colorScheme}-500 text-white px-4 py-2 rounded">
                          Sign In
                        </button>
                      )}` : ''}
                    </div>
                  </div>
                </div>
              </header>

              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Welcome to ${project.name}</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    ${project.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  {${JSON.stringify(config.features)}.map((feature, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                      <div className="text-4xl mb-4">✨</div>
                      <h3 className="text-lg font-semibold mb-2">{feature}</h3>
                      <p className="text-gray-600 dark:text-gray-300">AI-generated feature ready to use</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-${config.colorScheme}-500 to-${config.colorScheme}-600 rounded-lg p-8 text-white text-center">
                  <h3 className="text-2xl font-bold mb-4">🚀 AI-Generated Application</h3>
                  <p className="mb-6">This application was built by 6 AI agents working together</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>🏗️ Architect</div>
                    <div>🎨 UI/UX Designer</div>
                    <div>⚙️ Backend Developer</div>
                    <div>💾 Database Engineer</div>
                    <div>🧪 QA Tester</div>
                    <div>🚀 DevOps Engineer</div>
                  </div>
                </div>
              </main>
            </div>
          );
        }
    `;
  }

  private static generateSocialApp(project: Project, config: AppPreviewConfig): string {
    return `
        function App() {
          const { user, login } = useAuth();
          const [posts, setPosts] = useState([
            { id: 1, author: 'Alice Johnson', content: 'Just launched my new project! 🚀', likes: 24, time: '2h ago' },
            { id: 2, author: 'Bob Smith', content: 'Beautiful sunset today 🌅', likes: 18, time: '4h ago' },
            { id: 3, author: 'Carol Davis', content: 'Working on some exciting AI features!', likes: 31, time: '6h ago' }
          ]);

          const likePost = (id) => {
            setPosts(prev => prev.map(post => 
              post.id === id ? { ...post, likes: post.likes + 1 } : post
            ));
          };

          if (!user) {
            return (
              <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                  <h2 className="text-2xl font-bold mb-6">${project.name}</h2>
                  <p className="text-gray-600 mb-6">Connect with friends and share your moments</p>
                  <button
                    onClick={() => login('demo@social.com', 'password')}
                    className="w-full bg-${config.colorScheme}-500 hover:bg-${config.colorScheme}-600 text-white py-3 rounded-lg"
                  >
                    Join ${project.name}
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div className="min-h-screen bg-gray-100">
              <nav className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <h1 className="text-xl font-bold text-${config.colorScheme}-600">${project.name}</h1>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm">Welcome, {user.name}!</span>
                      <div className="w-8 h-8 bg-${config.colorScheme}-500 rounded-full flex items-center justify-center text-white text-sm">
                        {user.name.charAt(0)}
                      </div>
                    </div>
                  </div>
                </div>
              </nav>

              <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <textarea
                    placeholder="What's on your mind?"
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                    rows="3"
                  />
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-4 text-gray-500">
                      <button className="hover:text-${config.colorScheme}-500">📷 Photo</button>
                      <button className="hover:text-${config.colorScheme}-500">📍 Location</button>
                      <button className="hover:text-${config.colorScheme}-500">😊 Feeling</button>
                    </div>
                    <button className="bg-${config.colorScheme}-500 hover:bg-${config.colorScheme}-600 text-white px-6 py-2 rounded-lg">
                      Post
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {posts.map(post => (
                    <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-${config.colorScheme}-500 rounded-full flex items-center justify-center text-white mr-3">
                          {post.author.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{post.author}</h3>
                          <p className="text-sm text-gray-500">{post.time}</p>
                        </div>
                      </div>
                      <p className="text-gray-800 mb-4">{post.content}</p>
                      <div className="flex items-center space-x-6 text-gray-500">
                        <button
                          onClick={() => likePost(post.id)}
                          className="flex items-center space-x-2 hover:text-red-500"
                        >
                          <span>❤️</span>
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-${config.colorScheme}-500">
                          <span>💬</span>
                          <span>Comment</span>
                        </button>
                        <button className="flex items-center space-x-2 hover:text-${config.colorScheme}-500">
                          <span>🔄</span>
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </main>
            </div>
          );
        }
    `;
  }

  private static generateBlogApp(project: Project, config: AppPreviewConfig): string {
    return `
        function App() {
          const [posts] = useState([
            {
              id: 1,
              title: 'Getting Started with AI Development',
              excerpt: 'Learn the fundamentals of building AI-powered applications...',
              author: 'Tech Writer',
              date: '2024-01-15',
              readTime: '5 min read'
            },
            {
              id: 2,
              title: 'The Future of Web Development',
              excerpt: 'Exploring emerging trends and technologies shaping the web...',
              author: 'Web Expert',
              date: '2024-01-12',
              readTime: '8 min read'
            }
          ]);

          return (
            <div className="min-h-screen bg-gray-50">
              <header className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <h1 className="text-3xl font-bold text-${config.colorScheme}-600">${project.name}</h1>
                  <p className="text-gray-600 mt-2">Insights, tutorials, and thoughts on technology</p>
                </div>
              </header>

              <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="space-y-8">
                  {posts.map(post => (
                    <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-${config.colorScheme}-600 cursor-pointer">
                          {post.title}
                        </h2>
                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span>By {post.author}</span>
                            <span>{post.date}</span>
                            <span>{post.readTime}</span>
                          </div>
                          <button className="text-${config.colorScheme}-600 hover:text-${config.colorScheme}-700">
                            Read More →
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </main>
            </div>
          );
        }
    `;
  }

  private static generatePortfolioApp(project: Project, config: AppPreviewConfig): string {
    return `
        function App() {
          const [projects] = useState([
            { id: 1, title: 'E-commerce Platform', tech: 'React, Node.js', image: '🛒' },
            { id: 2, title: 'Mobile App Design', tech: 'Figma, React Native', image: '📱' },
            { id: 3, title: 'Data Visualization', tech: 'D3.js, Python', image: '📊' }
          ]);

          return (
            <div className="min-h-screen bg-gray-900 text-white">
              <header className="py-20 text-center">
                <div className="max-w-4xl mx-auto px-4">
                  <h1 className="text-5xl font-bold mb-4">${project.name}</h1>
                  <p className="text-xl text-gray-300 mb-8">Full-Stack Developer & Designer</p>
                  <button className="bg-${config.colorScheme}-500 hover:bg-${config.colorScheme}-600 text-white px-8 py-3 rounded-lg">
                    View My Work
                  </button>
                </div>
              </header>

              <section className="py-20 bg-gray-800">
                <div className="max-w-6xl mx-auto px-4">
                  <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {projects.map(project => (
                      <div key={project.id} className="bg-gray-700 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform">
                        <div className="p-6 text-center">
                          <div className="text-6xl mb-4">{project.image}</div>
                          <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                          <p className="text-gray-300 text-sm">{project.tech}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          );
        }
    `;
  }
}