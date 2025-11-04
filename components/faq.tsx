import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is Nano Banana?",
    answer:
      "Nano Banana is a user-friendly platform that provides a custom interface for Google's Gemini 2.5 Flash Image model. We enhance the base AI capabilities with features like credit management, usage tracking, batch processing, and optimized workflows. We are an independent service and not affiliated with Google or the model providers.",
  },
  {
    question: "How does the AI image editing work?",
    answer:
      "Simply upload your image and describe the changes you want in natural language. The AI technology understands context, maintains character consistency, and preserves scene integrity while making your requested edits.",
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
      "Yes! New users get 2 free credits (1 image generation) to try out the platform. You can upgrade to a paid plan anytime for more credits.",
  },
  {
    question: "What makes Nano Banana different from other AI editors?",
    answer:
      "We provide an intuitive, user-friendly interface with additional features like credit-based usage tracking, subscription management, and optimized workflows. Our platform is designed to make AI image editing accessible and efficient.",
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
