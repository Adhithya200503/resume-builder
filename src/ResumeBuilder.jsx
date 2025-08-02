import React from 'react';
import PropTypes from 'prop-types';

import "./ResumeBuilder.css"

const ATSFriendlyResume = ({ data , reference}) => {
  
    const safeData = {
        socialMediaLinks: [],
        experience: [],
        projects: [],
        education: [],
        achievements: [],
        customFields: {},
        ...data
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const parseSkills = (skillsString) => {
        if (!skillsString) return [];
        return skillsString.split('\n\n').map(section => {
            const parts = section.split(': ');
            if (parts.length < 2) return { title: parts[0], skills: [] };
            const [title, skills] = parts;
            return { title, skills: skills.split(', ') };
        });
    };

    return (
        <>
            <div className="container" ref={reference}>
               
                {safeData.profileImg && (
                    <div className="profile-img-container">
                        <img src={safeData.profileImg} alt="Profile" className="profile-img" />
                    </div>
                )}

                <header className="header">
                    {safeData.name && <h1>{safeData.name}</h1>}
                    {safeData.profession && <h2>{safeData.profession}</h2>}

                    <ul className="contact-info">
                        {safeData.email && <li><a href={`mailto:${safeData.email}`}>{safeData.email}</a></li>}
                        {safeData.phoneNumber && <li><a href={`tel:${safeData.phoneNumber}`}>{safeData.phoneNumber}</a></li>}
                        {(safeData.city || safeData.country) && <li>{`${safeData.city}, ${safeData.country}`}</li>}
                        {safeData.socialMediaLinks.map(link => (
                            <li key={link.type}><a href={link.url} target="_blank" rel="noopener noreferrer">{link.type} Profile</a></li>
                        ))}
                    </ul>
                </header>

                <main>
                    {safeData.description && (
                        <section className="section">
                            <h3>Summary</h3>
                            <p>{safeData.description}</p>
                        </section>
                    )}
                    
                    {safeData.experience.length > 0 && (
                        <section className="section">
                            <h3>Professional Experience</h3>
                            {safeData.experience.map((exp, index) => (
                                <div key={index} className="item">
                                    <h4>{exp.title}</h4>
                                    <div className="meta">
                                        <span>{exp.company}</span> | <span>{formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}</span>
                                    </div>
                                    <p>{exp.description}</p>
                                </div>
                            ))}
                        </section>
                    )}

                    {safeData.customFields.skills && (
                        <section className="section skills-section">
                            <h3>Skills</h3>
                            <ul>
                                {parseSkills(safeData.customFields.skills).map((skillSection, index) => (
                                   <li key={index}>
                                        <h5>{skillSection.title}</h5>
                                        <ul className="skill-list">
                                            {skillSection.skills.map((skill, i) => <li key={i}>{skill}{i < skillSection.skills.length - 1 ? ',' : ''}</li>)}
                                        </ul>
                                   </li>
                                ))}
                            </ul>
                        </section>
                    )}
                    
                    {safeData.projects.length > 0 && (
                         <section className="section">
                            <h3>Projects</h3>
                             {safeData.projects.map((project, index) => (
                                <div key={index} className="item">
                                    <h4>{project.title}</h4>
                                     {project.url && <div className="meta"><a href={project.url} target="_blank" rel="noopener noreferrer">Project Link</a></div>}
                                    <p>{project.description}</p>
                                 </div>
                             ))}
                        </section>
                    )}
                    
                    {safeData.education.length > 0 && (
                        <section className="section">
                            <h3>Education</h3>
                            {safeData.education.map((edu, index) => (
                                <div key={index} className="item">
                                    <h4>{edu.degree}</h4>
                                    <div className="meta">
                                        <span>{edu.institution}</span> | <span>{edu.year}</span>
                                    </div>
                                    {edu.description && <p>{edu.description}</p>}
                                </div>
                            ))}
                        </section>
                    )}

                    {safeData.achievements.length > 0 && (
                         <section className="section">
                            <h3>Awards and Achievements</h3>
                             <ul>
                                {safeData.achievements.map((ach, index) => (
                                    <li key={index}><strong>{ach.title}:</strong> {ach.description}</li>
                                ))}
                            </ul>
                        </section>
                    )}
                </main>
            </div>
        </>
    );
};

ATSFriendlyResume.propTypes = {
    data: PropTypes.shape({
        profileImg: PropTypes.string,
        name: PropTypes.string.isRequired,
        profession: PropTypes.string,
        email: PropTypes.string,
        phoneNumber: PropTypes.string,
        city: PropTypes.string,
        country: PropTypes.string,
        socialMediaLinks: PropTypes.arrayOf(PropTypes.shape({
            type: PropTypes.string,
            url: PropTypes.string
        })),
        description: PropTypes.string,
        experience: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            company: PropTypes.string,
            startDate: PropTypes.string,
            endDate: PropTypes.string,
            description: PropTypes.string
        })),
        customFields: PropTypes.shape({
            skills: PropTypes.string
        }),
        projects: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            url: PropTypes.string,
            description: PropTypes.string
        })),
        education: PropTypes.arrayOf(PropTypes.shape({
            degree: PropTypes.string,
            institution: PropTypes.string,
            year: PropTypes.string,
            description: PropTypes.string
        })),
        achievements: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string,
            description: PropTypes.string
        })),
    }).isRequired
};

export default ATSFriendlyResume;