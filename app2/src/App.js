import React from 'react';
const Button = React.lazy(() => import('app1/Button'));
function App() {
  return (
    <div>
      <h1>App 2</h1>
      <Button />
    </div>
  );
}

export default App;
