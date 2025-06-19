
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import emailjs from '@emailjs/browser';
import { Mail, Send, User, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
        to_name: 'MMK Universe Team',
      };

      await emailjs.send(
        'service_coewwii',
        'template_dw43m68',
        templateParams,
        'sVnZFKgronV-w46qG'
      );

      toast({
        title: "Message Sent Successfully! 🎉",
        description: "Thank you for reaching out. We'll get back to you within 24 hours.",
      });

      form.reset();
    } catch (error) {
      console.error('EmailJS Error:', error);
      toast({
        title: "Failed to Send Message",
        description: "Please try again later or contact us directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Contact Info */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4 text-gradient-primary">Get in Touch</h3>
          <p className="text-gray-300 text-lg leading-relaxed">
            We'd love to hear from you! Whether you have questions about our programs, 
            want to collaborate, or just want to say hello, don't hesitate to reach out.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-gray-300">
            <div className="w-10 h-10 bg-mmk-purple/20 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-mmk-purple" />
            </div>
            <div>
              <p className="font-medium">Email Us</p>
              <p className="text-sm text-gray-400">contact@mmkuniverse.com</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 text-gray-300">
            <div className="w-10 h-10 bg-mmk-purple/20 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-mmk-purple" />
            </div>
            <div>
              <p className="font-medium">Response Time</p>
              <p className="text-sm text-gray-400">Within 24 hours</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <h4 className="font-semibold mb-2 text-mmk-amber">Why Contact Us?</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• Program inquiries and guidance</li>
            <li>• Partnership opportunities</li>
            <li>• Technical support and assistance</li>
            <li>• Feedback and suggestions</li>
            <li>• Community collaboration</li>
          </ul>
        </div>
      </div>

      {/* Contact Form */}
      <Card className="glass-card border-white/10 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2 flex items-center">
            <Send className="w-5 h-5 mr-2 text-mmk-purple" />
            Send us a Message
          </h3>
          <p className="text-gray-400 text-sm">Fill out the form below and we'll get back to you soon.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-gray-300">
                      <User className="w-4 h-4 mr-2" />
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Your full name" 
                        className="bg-white/5 border-white/20 focus:border-mmk-purple"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-gray-300">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="your.email@example.com" 
                        className="bg-white/5 border-white/20 focus:border-mmk-purple"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Subject</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="What's this about?" 
                      className="bg-white/5 border-white/20 focus:border-mmk-purple"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      className="bg-white/5 border-white/20 focus:border-mmk-purple resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-mmk-purple to-mmk-amber hover:from-mmk-amber hover:to-mmk-purple text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:scale-100"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default ContactForm;
