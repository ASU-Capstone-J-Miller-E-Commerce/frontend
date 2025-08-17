import React, { useState } from "react";

export default function FAQPage() {
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    const faqData = {
        "What types of cues do you offer?": "We offer a wide variety of custom cues including traditional pool cues, snooker cues, and carom cues. Each cue is handcrafted with premium materials including exotic woods and crystals. Our collection features both classic designs and unique custom pieces tailored to your preferences.",
        
        "How long does it take to make a custom cue?": "Custom cue creation typically takes 4-6 weeks from order confirmation to completion. This timeframe allows us to carefully select materials, craft each component by hand, and ensure the highest quality finish. Rush orders may be available for an additional fee.",
        
        "What materials do you use in your cues?": "We use only premium materials including exotic hardwoods like ebony, cocobolo, and maple, along with genuine crystals and precious metals for inlays. Each material is carefully selected for both its aesthetic appeal and performance characteristics.",
        
        "Do you offer repairs and maintenance?": "Yes, we provide complete repair and maintenance services for all types of pool cues. This includes tip replacement, rewrapping, joint repairs, and refinishing. We also offer maintenance guides and care instructions for proper cue upkeep.",
        
        "Can I customize the design of my cue?": "Absolutely! We specialize in fully custom designs. You can choose from our selection of woods, crystals, inlay patterns, and wrapping styles, or work with our craftsmen to create a completely unique design based on your vision.",
        
        "What is your return policy?": "We offer a 30-day satisfaction guarantee on all custom cues. If you're not completely satisfied with your purchase, we'll work with you to make it right or provide a full refund. Custom orders may have specific terms that will be discussed during the ordering process.",
        
        "Do you ship internationally?": "Yes, we ship worldwide. International shipping rates and delivery times vary by location. All international shipments are fully insured and trackable. Please note that customs duties and taxes may apply depending on your country's regulations.",
        
        "How do I care for my crystal inlay cue?": "Crystal inlay cues require gentle care to maintain their beauty. Use a soft, dry cloth to clean the crystals and avoid harsh chemicals. Store your cue in a protective case when not in use, and avoid extreme temperature changes that could affect the materials."
    };

    const questions = Object.keys(faqData);

    const scrollToQuestion = (index) => {
        const element = document.getElementById(`question-${index}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setExpandedQuestion(index);
        }
    };

    const toggleQuestion = (index) => {
        setExpandedQuestion(expandedQuestion === index ? null : index);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <h1>Frequently Asked Questions</h1>
            </div>
            
            <div className="page-content">
                <div className="faq-navigation">
                    <h2>Quick Navigation</h2>
                    <ol className="faq-nav-list">
                        {questions.map((question, index) => (
                            <li key={index}>
                                <button 
                                    className="faq-nav-button"
                                    onClick={() => scrollToQuestion(index)}
                                >
                                    {question}
                                </button>
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="faq-questions">
                    {questions.map((question, index) => (
                        <div 
                            key={index} 
                            className="faq-item"
                            id={`question-${index}`}
                        >
                            <div 
                                className="faq-question-header"
                                onClick={() => toggleQuestion(index)}
                            >
                                <h3>
                                    <span className="question-number">{index + 1}.</span>
                                    {question}
                                </h3>
                                <i className={`fa-solid ${expandedQuestion === index ? 'fa-chevron-up' : 'fa-chevron-down'} faq-chevron`}></i>
                            </div>
                            
                            <div className={`faq-answer ${expandedQuestion === index ? 'expanded' : ''}`}>
                                <p>{faqData[question]}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}