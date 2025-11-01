import React, { useState } from "react";

export default function FAQPage() {
    const [expandedQuestion, setExpandedQuestion] = useState(null);

    const faqData = {
        "What will my cue cost?": `My cues start around $600. This would be for a merry widow (no inlays, points, or a wrap) and will depend greatly on the woods selected. From here, you can add points, a wrap, and/or inlays, which will increase the cost. The final cost depends on the materials chosen, the number of points, the complexity of the design, and the amount of time it takes to prepare personalized inlays, etc.
        If you have a design in mind, please contact me to discuss options and pricing.
        For custom designs, once the design is created and a final price is quoted, I require a 50% non-refundable* down payment to get started. This allows me to ensure any additional materials or necessary tools can be ordered to create your cue.
        *Partial refunds may be considered for extenuating circumstances.`,

        "How long will it take to build me a custom cue?": `This depends on the chosen materials and the complexity of the design. If I already have all the materials and they are sufficiently dried, I may potentially have a cue finished in 3–4 weeks. With more complex designs and materials needing to be ordered and/or dried, you might be looking at 4–5 months.`,

        "What types of cues do you offer?": `Currently, I offer a variety of custom cues as well as one-of-a-kind cues and short-run series of cues set to my own design.
        Some of the different types include:\n
        \t• Standard segmented butts, with a variety of shaft material options including Hard Maple, Kielwood, Purpleheart, and Carbon Fiber.
        \t• Jump Cues.
        \t• Break Cues.
        \t• I am working on my technique and tooling to offer full-splice cues and hope to have that option available very soon!
        \t• For snooker and carom cues, if you provide the desired dimensions, I can create a cue to your specifications.
        If you have something else in mind, please contact me to discuss options.`,

        "Do you offer repairs and maintenance?": `Yes, I will happily do local repair work and maintenance. However, I will charge shipping for anything from outside the general area.
        Some repairs may be beyond my capability or comfort level. If this is the case, I can often refer you to others who specialize in more detailed repairs and restorations. To be fully transparent, sometimes the liability is just too much to take on.
        If you contact me, I will gladly discuss any repair with you and find a solution for whatever is needed.`,

        "Do your cues come with a warranty?": `Yes. They have a lifetime warranty against defects in craftsmanship. Replacing a tip, cleaning a shaft, or fixing dents or chips will be considered a repair and will incur a charge. If you have any specific questions about my warranty, please feel free to contact me to discuss.`,

        "How do I order a custom cue?": `If it is one of my premade cues, you can order it directly from this site. If you have a design in mind, or even just some thoughts on what you want to see, you can start with the “Build-A-Cue” section on this site. This will create a basic canvas to start the process. For additional details, inlays, custom ringwork or veneers, or any other personalized components, just send me a message and we can discuss what you have in mind.`,

        "What is your return policy?": `If it is one of my premade cues and you are dissatisfied with it for any reason, you can return it within 14 days of delivery for a full refund. If within 30 days of delivery, a 20% restocking fee will be charged. If it is a customized cue, please contact me to discuss your options.`,

        "Do you ship internationally?": `Yes, I am most definitely willing and able to ship anywhere.`,

        "What benefits come from creating a profile? And is my information secure?": `Creating a profile allows you a first peek at newly completed cues and offers exclusive access to purchasing them a few days before they are made available to the general public. Having a profile will also allow you to save your design in the “Build-A-Cue” section, so you can come back to it and make changes anytime. You will also receive updates on new materials received and available to integrate into your cue design. All your information is completely secure and protected.`
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
                                <p style={{ whiteSpace: 'pre-line' }}>{faqData[question]}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}