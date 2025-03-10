import React, { useState } from 'react';
import man1 from './pics/man1.jpg';
import man2 from './pics/man2.jpg';
import woman from './pics/woman.jpg';

const teamMembers = [
  {
    id: 1,
    name: 'VICTOR OLUSHOLA AREMU',
    qualification: '(B.Tech, MsCIA, CISA, CEH, CHFI)',
    title: 'Position',
    image: man1,
    description: 'Decorated Sergeant with 10 years of service in the US Army, leading high-performing teams in dynamic environments. Expert Cybersecurity Analyst with proficiency in threat analysis, penetration testing, and incident response. Holding industry-recognized certifications, with a unique blend of military leadership and technical expertise, driving innovative cybersecurity solutions.',
  },
  {
    id: 2,
    name: '⁠TEMIDAYO OLUWASEGUN ABIODUN',
    qualification: '(B.Ed, MBA, fCMgr)',
    title: 'Position',
    image: woman,
    description: 'A Chartered Manager and Business Administrator with CMI Level 7 Diploma Certification, driving business growth through strategic leadership and management expertise. Skilled graphics designer with proficiency in Adobe Creative Suite. Experienced primary educator with expertise in instructional design, visual learning materials, and child development. A versatile professional with a unique blend of management, creative, and educational skills, offering excellent problem-solving, project management, and communication abilities.',
  },
  {
    id: 3,
    name: '⁠TOPE ADEWALE ABIODUN',
    qualification: '(B.Ed, B.Sc Health Promotion and Education)',
    title: 'Position',
    image: man2,
    description: 'Results-driven Graphics Designer and Health Educator with vast experience. Skilled in Adobe Creative Suite and design principles, with a strong background in health education and promotion. Proven track record of delivering engaging visual communications and educational programs, with excellent communication and project management skills.',
  },
];

const Teams = () => {
  return (
    <section id='team'>
      <div className="py-10 bg-[#ccd5d4]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const TeamMemberCard = ({ member }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition-transform transform duration-500 hover:scale-105"
    >
      <img
        src={member.image}
        alt={member.name}
        className="w-32 h-32 rounded-full mb-4"
      />
      <h3 className="text-xl font-semibold">{member.name}</h3>
      <h3 className="text-xs">{member.qualification}</h3>
      <p className="text-gray-600">{member.title}</p>
      <p className="text-gray-500 mt-2">
        {isExpanded ? member.description : `${member.description.substring(0, 100)}...`}
      </p>
      <button
        onClick={toggleDescription}
        className="mt-2 text-green-600 hover:underline"
      >
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
};

export default Teams;


