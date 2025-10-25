import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is Nano Banana?",
    answer:
      "Nano Banana is an advanced AI-powered image editing platform that allows you to transform images using simple text prompts. Our model delivers consistent character editing and scene preservation that surpasses other AI editors.",
  },
  {
    question: "How does the AI image editing work?",
    answer:
      "Simply upload your image and describe the changes you want in natural language. Our AI model understands context, maintains character consistency, and preserves scene integrity while making your requested edits.",
  },
  {
    question: "What file formats are supported?",
    answer:
      "We support all common image formats including JPG, PNG, WebP, and HEIC. Maximum file size is 50MB per image.",
  },
  {
    question: "Can I edit multiple images at once?",
    answer:
      "Yes! Our batch processing feature allows you to edit multiple images simultaneously with consistent results across your entire collection.",
  },
  {
    question: "How long does it take to process an image?",
    answer:
      "Most edits are completed in seconds. Processing time depends on the complexity of your request and image size, but our optimized pipeline ensures rapid results.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! New users get free credits to try out all features. You can upgrade to a paid plan anytime for unlimited access.",
  },
  {
    question: "What makes Nano Banana different from other AI editors?",
    answer:
      "Our advanced model excels at character consistency and scene preservation. We also offer natural language processing, batch editing, and faster processing times compared to competitors.",
  },
  {
    question: "Can I use edited images commercially?",
    answer:
      "Yes! All images you create with Nano Banana are yours to use commercially. Check our terms of service for full details on usage rights.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            Everything you need to know about Nano Banana
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
