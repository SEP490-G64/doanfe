const Unauthorized = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh', // Thay đổi từ height thành minHeight
            padding: '20px', // Thêm khoảng cách bên trong
            textAlign: 'center'
        }}>
            <img
                src="/images/unauthorized.png"
                alt="Unauthorized Access"
                style={{ width: '150px', marginBottom: '20px' }}
            />
            <h1 style={{ fontSize: '2rem', color: '#ff0000' }}>401 - Không có quyền truy cập</h1>
            <p style={{ fontSize: '1.25rem', marginTop: '1rem' }}>
                Bạn không có quyền truy cập vào trang này.
            </p>
            <a href="/" style={{ marginTop: '2rem', color: '#0070f3', textDecoration: 'underline' }}>
                Quay lại trang chủ
            </a>
        </div>
    );
};

export default Unauthorized;
