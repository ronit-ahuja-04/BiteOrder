import React, { useState } from 'react';
import { API_ORIGIN } from '../config';

const PRESET_REQUESTS = [
  {
    id: 'get-all',
    title: '1. GET All Dishes',
    method: 'GET',
    endpoint: '/api/menu',
    description: 'Retrieves all restaurant menu dishes with HTTP 200 OK.',
    body: null,
  },
  {
    id: 'get-by-id',
    title: '2. GET Dish by ID',
    method: 'GET',
    endpoint: '/api/menu/:id',
    description: 'Retrieves one dish from MongoDB by ObjectId (:id is auto-filled with the first dish).',
    body: null,
  },
  {
    id: 'post-create',
    title: '3. POST Create Dish',
    method: 'POST',
    endpoint: '/api/menu',
    description: 'Creates a new dish using req.body. Returns HTTP 201 Created.',
    body: JSON.stringify(
      {
        name: 'Tandoori Soya Chaap',
        category: 'starters',
        price: 220,
        isVeg: true,
        description: 'Juicy soya chaap marinated in spices and charred in clay oven.',
        prepTime: 14,
        calories: '290 kcal',
        availableAddons: [{ id: 'rumali', name: 'Extra Rumali Roti', price: 20 }],
      },
      null,
      2
    ),
  },
  {
    id: 'put-update',
    title: '4. PUT Update Dish',
    method: 'PUT',
    endpoint: '/api/menu/:id',
    description: 'Updates dish price & rating using req.params.id and req.body. Returns 200 OK.',
    body: JSON.stringify(
      {
        price: 275,
        rating: 4.9,
        isChefSpecial: true,
      },
      null,
      2
    ),
  },
  {
    id: 'delete-remove',
    title: '5. DELETE Remove Dish',
    method: 'DELETE',
    endpoint: '/api/menu/:id',
    description: 'Removes the first dish by ObjectId using req.params.id. Returns 200 OK.',
    body: null,
  },
  {
    id: 'err-404',
    title: '6. ERROR 404 (Item Not Found)',
    method: 'GET',
    endpoint: '/api/menu/64b7f0f0f0f0f0f0f0f0f0f0',
    description: 'Requests a valid-format but non-existent ObjectId. Demonstrates 404 Not Found error handling.',
    body: null,
  },
  {
    id: 'err-400',
    title: '7. ERROR 400 (Bad Request Validation)',
    method: 'POST',
    endpoint: '/api/menu',
    description: 'Sends empty payload missing name and price. Demonstrates 400 Bad Request.',
    body: JSON.stringify({ isVeg: true }, null, 2),
  },
  {
    id: 'post-order',
    title: '8. POST Place Order',
    method: 'POST',
    endpoint: '/api/orders',
    description: 'Submits a dine-in order for Table 04. Returns 201 Created with orderId.',
    body: JSON.stringify(
      {
        tableNumber: '04',
        orderType: 'dine-in',
        items: [{ id: 'demo-item', name: 'Paneer Tikka', quantity: 2, price: 260 }],
        subtotal: 520,
        gst: 26,
        total: 546,
        customer: { name: 'Ronit Ahuja', mobile: '9876543210' },
      },
      null,
      2
    ),
  },
  {
    id: 'get-orders',
    title: '9. GET All Orders',
    method: 'GET',
    endpoint: '/api/orders',
    description: 'Retrieves all recorded kitchen orders with 200 OK.',
    body: null,
  },
];

export default function ApiTesterModal({ isOpen, onClose, onRefreshMenu }) {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_REQUESTS[0]);
  const [method, setMethod] = useState(PRESET_REQUESTS[0].method);
  const [endpoint, setEndpoint] = useState(PRESET_REQUESTS[0].endpoint);
  const [bodyText, setBodyText] = useState(PRESET_REQUESTS[0].body || '');
  const [isLoading, setIsLoading] = useState(false);
  const [responseMeta, setResponseMeta] = useState(null);
  const [responseData, setResponseData] = useState(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setMethod(preset.method);
    setEndpoint(preset.endpoint);
    setBodyText(preset.body || '');
    setResponseMeta(null);
    setResponseData(null);
  };

  const handleSendRequest = async () => {
    setIsLoading(true);
    setResponseMeta(null);
    setResponseData(null);

    const startTime = performance.now();
    let resolvedEndpoint = endpoint;

    try {
      // Replace the :id placeholder with the ObjectId of the first dish stored in MongoDB
      if (endpoint.includes(':id')) {
        const list = await (await fetch(`${API_ORIGIN}/api/menu`)).json();
        resolvedEndpoint = endpoint.replace(':id', list.data?.[0]?.id ?? 'unknown');
      }
    } catch (e) {
      // handled by the main request below
    }
    const url = `${API_ORIGIN}${resolvedEndpoint}`;

    try {
      const options = {
        method,
        headers: {
          Accept: 'application/json',
          ...(localStorage.getItem('biteorder_token') ? { Authorization: `Bearer ${localStorage.getItem('biteorder_token')}` } : {}),
        },
      };

      if ((method === 'POST' || method === 'PUT') && bodyText.trim()) {
        options.headers['Content-Type'] = 'application/json';
        options.body = bodyText;
      }

      const res = await fetch(url, options);
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      let data;
      try {
        data = await res.json();
      } catch (err) {
        data = { error: 'Failed to parse JSON response' };
      }

      setResponseMeta({
        status: res.status,
        statusText: res.statusText || (res.status === 200 ? 'OK' : res.status === 201 ? 'Created' : res.status === 400 ? 'Bad Request' : res.status === 404 ? 'Not Found' : 'Error'),
        duration,
        url,
      });
      setResponseData(data);

      if (onRefreshMenu && (method === 'POST' || method === 'PUT' || method === 'DELETE')) {
        onRefreshMenu();
      }
    } catch (err) {
      const endTime = performance.now();
      setResponseMeta({
        status: 0,
        statusText: 'Connection Refused / Network Error',
        duration: Math.round(endTime - startTime),
        url,
      });
      setResponseData({
        error: 'Failed to connect to Express backend at http://localhost:5001. Ensure the Node.js server is running (`npm run server`).',
        details: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodBadge = (m) => {
    switch (m) {
      case 'GET':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'POST':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'PUT':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'DELETE':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const getStatusBadge = (code) => {
    if (code >= 200 && code < 300) return 'bg-emerald-500 text-white';
    if (code >= 400 && code < 500) return 'bg-amber-500 text-white';
    if (code >= 500) return 'bg-rose-500 text-white';
    return 'bg-slate-600 text-white';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black shadow-md shadow-orange-500/20">
              ⚡
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                BiteOrder RESTful API & Postman Testing Console
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 font-semibold">
                  Exp 4
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Interactive Node.js & Express.js REST API Runner • Base URL: <code className="text-orange-600">http://localhost:5001</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body: Left sidebar presets, Right interactive runner */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 min-h-0">
          
          {/* Left Presets List */}
          <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/80 p-3 space-y-1.5 overflow-y-auto max-h-[40vh] md:max-h-none">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Test Presets (CRUD & Errors)
            </div>
            {PRESET_REQUESTS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex flex-col gap-1 border cursor-pointer ${
                  selectedPreset.id === preset.id
                    ? 'bg-white border-[#E8590C] shadow-xs text-slate-900 font-semibold'
                    : 'bg-white/60 hover:bg-white border-transparent text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate">{preset.title}</span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${getMethodBadge(
                      preset.method
                    )}`}
                  >
                    {preset.method}
                  </span>
                </div>
                <div className="font-mono text-[10px] text-slate-500 truncate">
                  {preset.endpoint}
                </div>
              </button>
            ))}
          </div>

          {/* Right Runner Panel */}
          <div className="md:col-span-8 p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto bg-white">
            
            {/* Endpoint Bar */}
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold font-mono focus:ring-2 focus:ring-orange-500/20 focus:outline-none"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>

              <div className="flex-1 flex rounded-xl border border-slate-300 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500">
                <span className="px-3 py-2 text-xs font-mono text-slate-400 bg-slate-100 select-none hidden sm:inline">
                  http://localhost:5001
                </span>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs font-mono text-slate-800 bg-transparent focus:outline-none"
                  placeholder="/api/menu"
                />
              </div>

              <button
                onClick={handleSendRequest}
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-[#E8590C] hover:bg-orange-700 disabled:opacity-60 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {isLoading ? (
                  <span className="animate-spin text-sm">⏳</span>
                ) : (
                  <span>Send ▶</span>
                )}
              </button>
            </div>

            {/* Description note */}
            <div className="text-xs text-slate-600 bg-orange-50/60 p-2.5 rounded-xl border border-orange-100 flex items-start gap-2">
              <span className="text-orange-500 text-sm">ℹ️</span>
              <span>{selectedPreset.description}</span>
            </div>

            {/* Request Body (for POST / PUT) */}
            {(method === 'POST' || method === 'PUT') && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>JSON Request Body (req.body):</span>
                  <span className="text-[10px] text-slate-400 font-mono">application/json</span>
                </div>
                <textarea
                  rows={5}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-900 text-emerald-400 font-mono text-xs focus:ring-2 focus:ring-orange-500/20 focus:outline-none leading-relaxed"
                />
              </div>
            )}

            {/* Response Section */}
            <div className="flex-1 flex flex-col gap-2 min-h-[180px]">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 border-b border-slate-100 pb-1">
                <span>Response Output:</span>
                {responseMeta && (
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono font-bold text-[11px] ${getStatusBadge(
                        responseMeta.status
                      )}`}
                    >
                      {responseMeta.status} {responseMeta.statusText}
                    </span>
                    <span className="text-slate-400 text-[11px] font-mono">
                      ⏱ {responseMeta.duration} ms
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 bg-slate-900 rounded-xl p-3.5 overflow-x-auto text-xs font-mono max-h-[260px] border border-slate-800 shadow-inner">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center text-slate-400 gap-2">
                    <span className="animate-spin">🔄</span> Sending HTTP request to Express server...
                  </div>
                ) : responseData ? (
                  <pre
                    className={
                      responseMeta?.status >= 200 && responseMeta?.status < 300
                        ? 'text-emerald-400'
                        : responseMeta?.status >= 400
                        ? 'text-amber-300'
                        : 'text-rose-400'
                    }
                  >
                    {JSON.stringify(responseData, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 py-6 text-center">
                    <p>Click <strong className="text-orange-400">"Send ▶"</strong> above to dispatch this REST request to the Node.js/Express server.</p>
                    <p className="text-[11px] text-slate-600 mt-1">Status code, response headers, and JSON body will appear here.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Express.js v5.3.0 Server • Port 5001</span>
          </div>
          <div className="flex items-center gap-3">
            {onRefreshMenu && (
              <button
                onClick={onRefreshMenu}
                className="text-orange-600 hover:text-orange-800 font-bold underline cursor-pointer"
              >
                Re-fetch Menu on UI
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
