import '../public/stylesheets/index.css';

const HomePage = () => {
    return (
        <div>
            <div className="logo-and-text">
                <div className="logo-text">
                    <h1>Synergetic</h1>
                    <p>A coffee bar that works by the day & a club that works by the night!</p>
                </div>

                <div className="logo-placeholder">
                    { <img src="" alt="main-logo" className="logo" />}
                </div>
            </div>

            <main>
                <h2>You are on - Main Page</h2>
            </main>
        </div>
    );
};

export default HomePage;