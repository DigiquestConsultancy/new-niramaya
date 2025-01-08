import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/FAQ.css";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is homeopathy?",
      answer:
        "Homeopathy is a natural form of medicine that uses highly diluted substances to stimulate the body’s self-healing mechanisms.",
    },
    {
      question: "How does homeopathy work?",
      answer:
        "Homeopathy works by triggering the body's natural defenses. It is based on the principle of 'like cures like,' where substances that cause symptoms in a healthy person can help treat similar symptoms in a sick person.",
    },
    {
      question: "Are homeopathic treatments safe?",
      answer:
        "Yes, homeopathic treatments are safe when used as directed. They are non-toxic and free from side effects, making them suitable for all age groups, including children and pregnant women.",
    },
    {
      question: "How long does a homeopathic treatment take to show results?",
      answer:
        "The duration varies depending on the condition being treated, its severity, and the individual's response. Some conditions improve quickly, while chronic ailments may take longer.",
    },
    {
      question: "Can I use homeopathy alongside other treatments?",
      answer:
        "Yes, homeopathy can be used alongside conventional treatments. However, it is always recommended to consult your healthcare provider for advice on combining treatments.",
    },
  ];

  return (
    <div className="faq-section container">
      <h2 className="text-center mb-4">Frequently Asked Questions</h2>
      <div className="accordion" id="faqAccordion">
        {faqData.map((item, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header">
              <button
                className={`accordion-button ${
                  activeIndex === index ? "" : "collapsed"
                }`}
                type="button"
                onClick={() => toggleFAQ(index)}
              >
                {item.question}
              </button>
            </h2>
            <div
              className={`accordion-collapse collapse ${
                activeIndex === index ? "show" : ""
              }`}
            >
              <div className="accordion-body">{item.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
