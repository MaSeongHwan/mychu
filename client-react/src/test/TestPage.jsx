import React from 'react';

const TestPage = () => {
  console.log('TestPage 렌더링됨');
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'lightgray',
      minHeight: '100vh',
      color: 'black'
    }}>
      <h1>테스트 페이지</h1>
      <p>이 페이지가 보인다면 React는 정상 작동 중입니다.</p>
      <button onClick={() => alert('버튼 클릭됨!')}>
        클릭 테스트
      </button>
    </div>
  );
};

export default TestPage;
