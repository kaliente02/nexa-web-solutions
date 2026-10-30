import Card from "./Card.jsx";
import { revealDelay } from "../reveal.js";

const MEMBERS = [
  {
    name: "Engr. Kims Cyra Rayel M. Moring",
    role: "Full-Stack & Blockchain Developer",
    bio: "Leads discovery, architecture and every client conversation, end to end.",
    photo: "/images/team/team-1.png",
    badge: "Founder"
  },
  {
    name: "Engr. John Lesther Dy",
    role: "Frontend Developer",
    bio: "Builds the interfaces your users interact with.",
    photo: "/images/team/team-2.jpg"
  },
  {
    name: "Engr. Camila Kim Supremo",
    role: "Quality Assurance",
    bio: "Tests every build and program across devices, wallets and clusters before launch.",
    photo: "/images/team/team-3.jpg"
  },
  {
    name: "Engr. Crystle Wyne Piodos",
    role: "UI/UX Designer",
    bio: "Shapes the look, feel and usability of every interface we ship.",
    photo: "/images/team/team-4.jpg"
  }
];

export default function Team() {
  return (
    <section className="section" id="team" aria-labelledby="team-heading" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">The team</span>
          <h2 className="section-title" id="team-heading">The people building your project.</h2>
          <p className="section-lead">One founder as your point of contact, backed by a small specialized team.</p>
        </div>

        <div className="team">
          {MEMBERS.map((member, index) => (
            <Card key={member.name} className="member reveal" style={revealDelay(index * 60)}>
              <div className="member-photo">
                {member.badge && <span className="member-badge">{member.badge}</span>}
                <img src={member.photo} alt={member.name} loading="lazy" />
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <div className="member-role">{member.role}</div>
                <p>{member.bio}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
