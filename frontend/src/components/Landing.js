import React from "react";

export default function Landing() {
  return (
    <div>
      <h1>🩸 LifeLink Blood Bank Management System</h1>
      <p style={{fontSize: "20px", textAlign: "center"}}>
        Connecting Donors, Hospitals, and Hope — Securely, Smartly, Swiftly.
      </p>
      <section style={{marginTop: 48}}>
        <h2>🌟 Our Mission</h2>
        <p>
          <b>LifeLink</b> strives to ensure that every person in need of blood receives safe and timely transfusions. Our AI-driven platform efficiently <b>matches donors, patients, and hospitals</b>, minimizes wastage, and boosts transparency.
        </p>
        <h2>🚀 Goals</h2>
        <ul style={{fontSize:"18px"}}>
          <li>Maintain real-time, secure blood inventory across connected hospitals.</li>
          <li>Simplify patient requests, donor registration, and billing with modern UI.</li>
          <li>Empower health staff with analytics, alerts, and automated compliance.</li>
          <li>Prioritize rare blood group tracking and fair distribution.</li>
          <li>Enable feedback to constantly improve our lifesaving service.</li>
        </ul>
        <h2>💬 Feedback & Support</h2>
        <p>
          Your experience matters! Found an issue? Have ideas to make LifeLink better?
          <br />
          <a href="mailto:support@lifelink.org" style={{color:"#b00"}}>Contact us anytime.</a>
        </p>
      </section>
    </div>
  );
}
<form
  style={{margin:"32px auto", maxWidth: 400, background: "#fff9", padding: 24, borderRadius: 8}}
  onSubmit={e => { e.preventDefault(); alert("Thank you for your feedback!"); }}
>
  <h3 style={{textAlign: "center", color: "#A02424"}}>Send Feedback</h3>
  <textarea rows={5} placeholder="Your feedback..." style={{width:"100%", borderRadius:8, padding:8}} required />
  <button type="submit" className="btn btn-danger" style={{marginTop: 12, width:"100%"}}>Submit</button>
</form>
