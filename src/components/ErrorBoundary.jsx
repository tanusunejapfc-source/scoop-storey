import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Scoop Storey uncaught UI error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    try {
      // Clear any potentially corrupted state
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fff0f5 0%, #ffe4ec 50%, #fff 100%)',
          fontFamily: "'Fredoka', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          padding: '24px',
          textAlign: 'center',
          color: '#374151'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '28px',
            padding: '36px 28px',
            maxWidth: '460px',
            width: '100%',
            boxShadow: '0 20px 40px -15px rgba(255, 77, 141, 0.25)',
            border: '2px solid #ffd1dc'
          }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🍧✨</div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#ff2d75',
              margin: '0 0 10px 0'
            }}>
              Oops! A Tiny Hiccup
            </h1>
            <p style={{
              fontSize: '15px',
              lineHeight: '1.6',
              color: '#6b7280',
              margin: '0 0 24px 0'
            }}>
              Scoop Storey encountered a small glitch while loading cute goodies. Don't worry, your items and cart are safe!
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={this.handleReload}
                style={{
                  background: 'linear-gradient(135deg, #ff2d75 0%, #ff5c8a 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '14px 24px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(255, 45, 117, 0.35)',
                  transition: 'transform 0.15s ease'
                }}
              >
                Reload Scoop Storey ✨
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  background: '#fdf2f4',
                  color: '#ff2d75',
                  border: '1px solid #ffd1dc',
                  borderRadius: '9999px',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Return to Home 🏠
              </button>
            </div>
            {this.state.error && (
              <details style={{ marginTop: '20px', textAlign: 'left', fontSize: '11px', color: '#9ca3af' }}>
                <summary style={{ cursor: 'pointer' }}>Error Details (Diagnostic)</summary>
                <pre style={{
                  marginTop: '8px',
                  padding: '8px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap'
                }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

