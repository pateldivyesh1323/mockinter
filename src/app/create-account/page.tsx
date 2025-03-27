"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Types } from "mongoose";
import { ButtonLoading } from "../components/ui/button-loading";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Alert, AlertDescription } from "../components/ui/alert";
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

type DataType = {
    name: string;
    email: string;
    id: Types.ObjectId;
    image: string;
};

type ResponseType = {
    success: boolean;
    message: string;
    data?: DataType;
};

export default function CreateAccount(): React.ReactNode {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
        role: "INTERVIEWEE",
        age: "",
        about: "",
        location: "",
        profession: "",
        skills: "",
        experience: "",
    });
    const [isValidPass, setIsValidPass] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [passwordValidation, setPasswordValidation] = useState({
        hasLength: false,
        hasNumber: false,
        hasSpecial: false,
        hasCapital: false,
        matches: false,
    });
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const router = useRouter();

    const createNewUser = async (): Promise<DataType | undefined> => {
        try {
            const userData = {
                ...formData,
                skills: formData.skills.split(",").map((skill) => skill.trim()),
                experience: parseInt(formData.experience) || 0,
                age: parseInt(formData.age) || null,
            };

            const res: Response = await fetch("/api/user/signup", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(userData),
            });
            let { message, success, data }: ResponseType = await res.json();
            if (success && data) {
                toast.success(message);
                return data;
            } else {
                toast.error(message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
        return undefined;
    };

    const handleCreateAccountFormSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (
                !formData.name ||
                !formData.email ||
                !formData.password ||
                !formData.confirmpassword
            ) {
                toast.error("Please provide all required credentials!");
                return;
            }
            if (!isValidPass) {
                toast.error("Password must fulfill all requirements!");
                return;
            }
            let userdata = await createNewUser();
            if (!userdata) {
                return;
            }
            let { id, email: emailId } = userdata;
            let emaildata = await fetch("/api/user/sendverificationmail", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({ userId: id, email: emailId }),
            });
            let emailres = await emaildata.json();
            if (emailres.success) {
                toast.success(emailres.message);
            } else {
                toast.error(emailres.message);
            }
            router.push("/home");
        } catch (error: any) {
            toast.error("Error : " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const validatePassword = (password: string, confirmPassword: string) => {
        const validation = {
            hasLength: password.length >= 8,
            hasNumber: /\d/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            hasCapital: /[A-Z]/.test(password),
            matches: password === confirmPassword && password !== "",
        };

        setPasswordValidation(validation);
        setIsValidPass(Object.values(validation).every(Boolean));
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => {
            const newData = {
                ...prev,
                [name]: value,
            };

            if (name === "password" || name === "confirmpassword") {
                validatePassword(
                    name === "password" ? value : newData.password,
                    name === "confirmpassword" ? value : newData.confirmpassword
                );
            }

            return newData;
        });
    };

    const PasswordRequirement = ({
        met,
        text,
    }: {
        met: boolean;
        text: string;
    }) => (
        <div className="flex items-center gap-2 text-sm">
            {met ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
                <XCircle className="h-4 w-4 text-red-500" />
            )}
            <span className={met ? "text-green-500" : "text-red-500"}>
                {text}
            </span>
        </div>
    );

    const nextStep = () => {
        if (step === 1) {
            // Validate basic info
            if (!formData.name || !formData.email || !formData.role) {
                toast.error("Please fill in all required fields");
                return;
            }
        }
        if (step === 2) {
            // Validate password
            if (!isValidPass) {
                toast.error("Please ensure password meets all requirements");
                return;
            }
        }
        setStep(Math.min(step + 1, totalSteps));
    };

    const prevStep = () => {
        setStep(Math.max(step - 1, 1));
    };

    const renderStepIndicator = () => (
        <div className="flex justify-center mb-8">
            {[1, 2, 3, 4].map((index) => (
                <div key={index} className="flex items-center">
                    <div
                        className={`rounded-full h-8 w-8 flex items-center justify-center ${
                            step >= index
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                        }`}
                    >
                        {index}
                    </div>
                    {index < 4 && (
                        <div
                            className={`h-1 w-10 ${
                                step > index ? "bg-primary" : "bg-muted"
                            }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="space-y-4"
                    >
                        <CardDescription className="text-center mb-6">
                            Let's start with the basics
                        </CardDescription>
                        <div>
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                required
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                required
                                type="email"
                                name="email"
                                id="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="role">Role *</Label>
                            <Select
                                name="role"
                                value={formData.role}
                                onValueChange={(value: string) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        role: value,
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INTERVIEWEE">
                                        Interviewee
                                    </SelectItem>
                                    <SelectItem value="INTERVIEWER">
                                        Interviewer
                                    </SelectItem>
                                    <SelectItem value="BOTH">Both</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="space-y-4"
                    >
                        <CardDescription className="text-center mb-6">
                            Secure your account
                        </CardDescription>
                        <div>
                            <Label htmlFor="password">Password *</Label>
                            <Input
                                required
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="confirmpassword">
                                Confirm password *
                            </Label>
                            <Input
                                required
                                type="password"
                                name="confirmpassword"
                                id="confirmpassword"
                                placeholder="Confirm your password"
                                value={formData.confirmpassword}
                                onChange={handleInputChange}
                            />
                        </div>
                        {(formData.password || formData.confirmpassword) && (
                            <Alert className="bg-muted/50">
                                <AlertDescription>
                                    <div className="grid grid-cols-1 gap-2">
                                        <PasswordRequirement
                                            met={passwordValidation.hasLength}
                                            text="At least 8 characters"
                                        />
                                        <PasswordRequirement
                                            met={passwordValidation.hasCapital}
                                            text="Contains uppercase letter"
                                        />
                                        <PasswordRequirement
                                            met={passwordValidation.hasNumber}
                                            text="Contains number"
                                        />
                                        <PasswordRequirement
                                            met={passwordValidation.hasSpecial}
                                            text="Contains special character"
                                        />
                                        <PasswordRequirement
                                            met={passwordValidation.matches}
                                            text="Passwords match"
                                        />
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="space-y-4"
                    >
                        <CardDescription className="text-center mb-6">
                            Tell us about yourself
                        </CardDescription>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    type="number"
                                    name="age"
                                    id="age"
                                    placeholder="Your age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    type="text"
                                    name="location"
                                    id="location"
                                    placeholder="Your location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="profession">Profession</Label>
                            <Input
                                type="text"
                                name="profession"
                                id="profession"
                                placeholder="Your profession"
                                value={formData.profession}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="about">About</Label>
                            <Textarea
                                name="about"
                                id="about"
                                placeholder="Tell us about yourself"
                                value={formData.about}
                                onChange={handleInputChange}
                                className="h-20"
                            />
                        </div>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="space-y-4"
                    >
                        {formData.role === "INTERVIEWER" ||
                        formData.role === "BOTH" ? (
                            <>
                                <CardDescription className="text-center mb-6">
                                    Your interviewer profile
                                </CardDescription>
                                <div>
                                    <Label htmlFor="skills">
                                        Skills (comma-separated)
                                    </Label>
                                    <Input
                                        type="text"
                                        name="skills"
                                        id="skills"
                                        placeholder="e.g., JavaScript, React, Node.js"
                                        value={formData.skills}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="experience">
                                        Years of Experience
                                    </Label>
                                    <Input
                                        type="number"
                                        name="experience"
                                        id="experience"
                                        placeholder="Years of experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </>
                        ) : (
                            <CardDescription className="text-center mb-6">
                                Ready to create your account!
                            </CardDescription>
                        )}
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-6 w-6"
                    >
                        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                    MockInter
                </div>
                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-2">
                        <p className="text-lg">
                            "Join our community of professionals and enhance
                            your interview skills. Whether you're an interviewer
                            or interviewee, we've got you covered."
                        </p>
                        <footer className="text-sm">The MockInter Team</footer>
                    </blockquote>
                </div>
            </div>
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
                    <Card className="border-none shadow-none">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl text-center">
                                Create an account
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {renderStepIndicator()}
                            <form onSubmit={handleCreateAccountFormSubmit}>
                                {renderStepContent()}
                                <div className="flex justify-between mt-8">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={prevStep}
                                        disabled={step === 1}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-2" />
                                        Back
                                    </Button>
                                    {step < totalSteps ? (
                                        <Button
                                            type="button"
                                            onClick={nextStep}
                                        >
                                            Next
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    ) : (
                                        <ButtonLoading
                                            loading={loading}
                                            type="submit"
                                        >
                                            Create Account
                                        </ButtonLoading>
                                    )}
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
