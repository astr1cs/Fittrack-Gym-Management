export const metadata = {
  title: 'FitTrack — Gym Management Platform',
  description: 'Keep your members, trainers, classes, and memberships in one place.',
}

export default function LandingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&display=swap');

        .landing-body {
          font-family: 'DM Sans', system-ui, sans-serif;
          background: #ffffff;
          color: #111111;
          -webkit-font-smoothing: antialiased;
          margin: 0;
          padding-inline: 24px;
        }

        .landing-body * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .landing-body a {
          text-decoration: none;
          color: inherit;
        }

        .l-nav {
          max-width: 1080px;
          margin: 0 auto;
          padding-block: 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #E5E5E5;
        }

        .l-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.2rem;
          letter-spacing: -0.02em;
          color: #111;
        }

        .l-logo span { color: #16A34A; }

        .l-nav-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .l-nav-link {
          font-size: 0.875rem;
          color: #555;
        }

        .l-btn {
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          padding: 9px 18px;
          border-radius: 7px;
          border: none;
          cursor: pointer;
          display: inline-block;
        }

        .l-btn-dark {
          background: #111;
          color: #fff;
        }

        .l-btn-ghost {
          background: transparent;
          color: #555;
          border: 1px solid #E5E5E5;
        }

        .l-hero {
          max-width: 1080px;
          margin: 0 auto;
          padding-block: 100px;
          text-align: center;
        }

        .l-eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #16A34A;
          font-weight: 500;
          margin-bottom: 20px;
        }

        .l-h1 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.8rem, 6vw, 4.2rem);
          line-height: 1.06;
          letter-spacing: -0.04em;
          color: #111;
          text-wrap: balance;
          margin-bottom: 20px;
        }

        .l-sub {
          font-size: 1.05rem;
          color: #555;
          max-width: 48ch;
          margin: 0 auto 36px;
          line-height: 1.7;
        }

        .l-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        @media (max-width: 600px) {
          .l-nav-link { display: none; }
        }
      `}</style>

      <div className="landing-body">
        <nav className="l-nav">
          <a href="/" className="l-logo">Fit<span>Track</span></a>
          <div className="l-nav-right">
            <a href="#" className="l-nav-link">Features</a>
            <a href="#" className="l-nav-link">Who it&apos;s for</a>
            <a href="/auth/login" className="l-btn l-btn-ghost">Sign in</a>
            <a href="/auth/register" className="l-btn l-btn-dark">Get started</a>
          </div>
        </nav>

        <section className="l-hero">
          <p className="l-eyebrow">Gym Management Platform</p>
          <h1 className="l-h1">Run your gym,<br />not your inbox.</h1>
          <p className="l-sub">
            FitTrack keeps your members, trainers, classes, and memberships in one place — so nothing falls through the cracks.
          </p>
          <div className="l-actions">
            <a href="/auth/register" className="l-btn l-btn-dark">Get started free</a>
            <a href="/auth/login" className="l-btn l-btn-ghost">Sign in</a>
          </div>
        </section>
      </div>
    </>
  )
}
