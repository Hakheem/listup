"use client";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import React, { useState } from "react";

interface FormState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
};

const ContactPage = () => {
  const [formData, setFormData] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const validateField = (name: keyof FormState, value: string): string => {
    const trimmed = value.trim();

    switch (name) {
      case "firstName":
        if (!trimmed) return "First name is required.";
        if (trimmed.length < 2)
          return "First name must be at least 2 characters.";
        return "";
      case "lastName":
        if (!trimmed) return "Last name is required.";
        if (trimmed.length < 2)
          return "Last name must be at least 2 characters.";
        return "";
      case "phone":
        if (!trimmed) return "";
        if (!/^[+]?[\d\s()-]{7,18}$/.test(trimmed)) {
          return "Enter a valid phone number.";
        }
        return "";
      case "email":
        if (!trimmed) return "Email address is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
          return "Enter a valid email address.";
        }
        return "";
      case "subject":
        if (!trimmed) return "Please select a subject.";
        return "";
      case "message":
        if (!trimmed) return "Message is required.";
        if (trimmed.length < 10) {
          return "Message should be at least 10 characters.";
        }
        return "";
      default:
        return "";
    }
  };

  const validateForm = (data: FormState): FormErrors => {
    const nextErrors: FormErrors = {};
    (Object.keys(data) as (keyof FormState)[]).forEach((field) => {
      const error = validateField(field, data[field]);
      if (error) nextErrors[field] = error;
    });
    return nextErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormState;

    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (submittedSuccess) setSubmittedSuccess(false);

    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: validateField(fieldName, value),
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormState;
    setErrors((prev) => ({
      ...prev,
      [fieldName]: validateField(fieldName, value),
    }));
  };

  const handleSubjectChange = (value: string | null) => {
    const nextValue = value ?? "";
    setFormData((prev) => ({ ...prev, subject: nextValue }));
    if (submittedSuccess) setSubmittedSuccess(false);
    setErrors((prev) => ({
      ...prev,
      subject: validateField("subject", nextValue),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSubmittedSuccess(false);

    // Simulated send request
    setTimeout(() => {
      console.log("Enquiry submitted (simulated):", formData);
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setFormData(INITIAL_FORM);
      setErrors({});
    }, 900);
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-linear-to-b from-primary/15 to-transparent py-16 md:py-20">
        <Container>
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto gap-3">
            <h1 className="text-3xl md:text-4xl font-semibold text-primary">
              Contact Us
            </h1>
            <p className="text-muted-foreground">
              Choose what you need help with and we&apos;ll point you in the
              right direction.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            {/* Left Column: Direct Contact */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold">Get in Touch</h2>
                <p className="text-sm text-muted-foreground">
                  Prefer direct contact? Use any of the options below.
                </p>
              </div>

              <div className="space-y-6 flex flex-col">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/15 text-primary p-2.5 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Email
                    </p>
                    <a
                      href="mailto:hello@listup.co.ke"
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      hello@listup.co.ke
                    </a>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/15 text-primary p-2.5 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Phone
                    </p>
                    <a
                      href="tel:+254769531724"
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      +254 769 531 724
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/15 text-primary p-2.5 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Location
                    </p>
                    <p className="text-sm font-medium">Nairobi, Kenya</p>
                  </div>
                </div>

                {/* Support Hours */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary/15 text-primary p-2.5 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Support Hours
                    </p>
                    <p className="text-sm font-medium">Monday – Friday</p>
                    <p className="text-sm font-medium">8:00 AM – 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Send an Enquiry Card */}
            <div className="md:col-span-2 bg-card rounded-xl p-6 md:p-8 shadow-md">
              <h2 className="text-xl font-semibold mb-6">Send an Enquiry</h2>

              {submittedSuccess && (
                <div className="mb-5 flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400 animate-in fade-in duration-200">
                  <CheckCircle2 className="size-4 shrink-0" />
                  <span>
                    Enquiry sent! We&apos;ll get back to you during support
                    hours.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="firstName"
                      className="text-xs font-medium text-foreground"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Enter First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(errors.firstName)}
                      className="h-auto rounded-lg bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-destructive">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="lastName"
                      className="text-xs font-medium text-foreground"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Enter Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(errors.lastName)}
                      className="h-auto rounded-lg bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-destructive">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="phone"
                      className="text-xs font-medium text-foreground"
                    >
                      Phone Number{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+254 XXX XXX XXX"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(errors.phone)}
                      className="h-auto rounded-lg bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label
                      htmlFor="email"
                      className="text-xs font-medium text-foreground"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="hello@listup.co.ke"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(errors.email)}
                      className="h-auto rounded-lg bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="subject"
                    className="text-xs font-medium text-foreground"
                  >
                    Subject
                  </Label>
                  <Select
                    value={formData.subject}
                    onValueChange={handleSubjectChange}
                  >
                    <SelectTrigger
                      id="subject"
                      aria-invalid={Boolean(errors.subject)}
                      className="w-full h-auto rounded-lg bg-background px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-primary/40"
                    >
                      <SelectValue placeholder="What is your enquiry about?" />
                    </SelectTrigger>
                    <SelectContent className="p-1.5">
                      <SelectItem
                        value="business-listing"
                        className="px-3 py-2 my-0.5"
                      >
                        Business Listing
                      </SelectItem>
                      <SelectItem
                        value="professional-profile"
                        className="px-3 py-2 my-0.5"
                      >
                        Professional Profile
                      </SelectItem>
                      <SelectItem
                        value="jobs-hiring"
                        className="px-3 py-2 my-0.5"
                      >
                        Jobs &amp; Hiring
                      </SelectItem>
                      <SelectItem value="data-hub" className="px-3 py-2 my-0.5">
                        Data Hub
                      </SelectItem>
                      <SelectItem value="general" className="px-3 py-2 my-0.5">
                        General Support
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.subject && (
                    <p className="text-xs text-destructive">{errors.subject}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="message"
                    className="text-xs font-medium text-foreground"
                  >
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell us how we can help"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-invalid={Boolean(errors.message)}
                    className="rounded-lg bg-background px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 resize-none"
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive">{errors.message}</p>
                  )}
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-7 py-2.5 h-auto rounded-lg text-sm font-medium transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      "Send Enquiry"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default ContactPage;
