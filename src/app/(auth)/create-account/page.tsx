"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Label } from "@/src/app/components/ui/label";
import { Input } from "@/src/app/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/app/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/app/components/ui/select";
import { Textarea } from "@/src/app/components/ui/textarea";
import { Alert, AlertDescription } from "@/src/app/components/ui/alert";
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/src/app/components/ui/button";
import { toast } from "sonner";
import { Checkbox } from "@/src/app/components/ui/checkbox";
import { Calendar } from "@/src/app/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/app/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useAuth } from "@/srcapp/Context/AuthContext";
import { ButtonLoading } from "@/src/app/components/ui/button-loading";
import { useDebouncedCallback } from "use-debounce";
import { useMutation } from "@tanstack/react-query";
import { checkUsername } from "@/src/app/query/authentication";
import { CHECK_USERNAME_MUTATION_KEY } from "@/src/constants";

export default function CreateAccount(): React.ReactNode {
    const { signUpMutation, isSignUpLoading } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
        role: "INTERVIEWEE",
        dateOfBirth: "",
        about: "",
        location: "",
        profession: "",
        skills: "",
        experience: [
            {
                title: "",
                description: "",
                startDate: "",
                endDate: "",
                isCurrentlyWorking: false,
            },
        ],
    });
    const [usernameExists, setUsernameExists] = useState<boolean>(false);
    const [isValidPass, setIsValidPass] = useState<boolean>(false);
    const [passwordValidation, setPasswordValidation] = useState({
        hasLength: false,
        hasNumber: false,
        hasSpecial: false,
        hasCapital: false,
        matches: false,
    });
    const [usernameValidation, setUsernameValidation] = useState({
        hasLength: false,
        hasNoSpaces: false,
        hasNoSpecialChars: false,
    });

    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const [calendarDates, setCalendarDates] = useState<{
        [key: string]: Date | undefined;
    }>({});

    const [dob, setDob] = useState<Date | undefined>(undefined);

    const handleCreateAccountFormSubmit = async (
        e: FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        try {
            if (
                !formData.name ||
                !formData.email ||
                !formData.password ||
                !formData.confirmpassword ||
                !formData.username
            ) {
                toast.error("Please provide all required credentials!");
                return;
            }
            if (!isValidPass) {
                toast.error("Password must fulfill all requirements!");
                return;
            }

            const userData = {
                ...formData,
                skills: formData.skills.split(",").map((skill) => skill.trim()),
                experience: formData.experience.filter(
                    (exp) => exp.title && exp.startDate
                ),
                dateOfBirth: formData.dateOfBirth,
            };
            signUpMutation(userData);
        } catch (error: any) {
            toast.error("Error : " + error.message);
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

    const validateUsername = (username: string) => {
        const validation = {
            hasLength: username.length >= 6 && username.length <= 30,
            hasNoSpaces: !/\s/.test(username),
            hasNoSpecialChars: /^[a-zA-Z0-9_]+$/.test(username),
        };
        setUsernameValidation(validation);
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

            if (name === "username") {
                validateUsername(value);
                debouncedCheckUsername(value);
            }

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

    const UsernameRequirement = ({
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
            if (
                !formData.name ||
                !formData.email ||
                !formData.role ||
                !formData.username
            ) {
                toast.error("Please fill in all required fields");
                return;
            }
            if (usernameExists) {
                toast.error("Username already exists");
                return;
            }
        }
        if (step === 2) {
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

    const { mutate: checkUserNameMutation, isPending: isCheckUserNameLoading } =
        useMutation({
            mutationKey: [CHECK_USERNAME_MUTATION_KEY, formData.username],
            mutationFn: checkUsername,
            onSuccess: (data) => {
                setUsernameExists(data.data.exists);
            },
            onError: (error) => {
                toast.error("Error : " + error.message);
            },
        });

    const debouncedCheckUsername = useDebouncedCallback(
        (value: string) => {
            if (value.length > 0) {
                checkUserNameMutation(value);
            }
        },
        500,
        { leading: false, trailing: true }
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
                            <Label htmlFor="username">Username *</Label>
                            <Input
                                required
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={(e) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        username: e.target.value,
                                    }));
                                    validateUsername(e.target.value);
                                    debouncedCheckUsername(e.target.value);
                                }}
                            />
                            {formData.username && (
                                <div className="grid grid-cols-1 gap-2 mt-2">
                                    <UsernameRequirement
                                        met={usernameValidation.hasLength}
                                        text="6 to 30 characters"
                                    />
                                    <UsernameRequirement
                                        met={usernameValidation.hasNoSpaces}
                                        text="No spaces"
                                    />
                                    <UsernameRequirement
                                        met={
                                            usernameValidation.hasNoSpecialChars
                                        }
                                        text="Only letters, numbers, and underscores"
                                    />
                                </div>
                            )}
                            {usernameExists && (
                                <div className="text-red-600 text-sm mt-1">
                                    Username already exists. Please choose a
                                    different username.
                                </div>
                            )}
                        </div>
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
                                <Label htmlFor="dateOfBirth">
                                    Date of Birth
                                </Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                            id="dateOfBirth"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dob ? (
                                                format(dob, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={dob}
                                            onSelect={(date) => {
                                                setDob(date);
                                                if (date) {
                                                    const formattedDate =
                                                        format(
                                                            date,
                                                            "yyyy-MM-dd"
                                                        );
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        dateOfBirth:
                                                            formattedDate,
                                                    }));
                                                }
                                            }}
                                            initialFocus
                                            captionLayout="dropdown"
                                            fromYear={1940}
                                            toYear={
                                                new Date().getFullYear() - 10
                                            }
                                            className="rounded-md border"
                                        />
                                    </PopoverContent>
                                </Popover>
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
                                <div className="space-y-3">
                                    <Label>Work Experience</Label>
                                    {formData.experience.map((exp, index) => (
                                        <div
                                            key={index}
                                            className="space-y-2 border p-3 rounded-md"
                                        >
                                            <Input
                                                placeholder="Job Title"
                                                value={exp.title}
                                                onChange={(e) => {
                                                    const newExperience = [
                                                        ...formData.experience,
                                                    ];
                                                    newExperience[index].title =
                                                        e.target.value;
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        experience:
                                                            newExperience,
                                                    }));
                                                }}
                                            />
                                            <Textarea
                                                placeholder="Job Description"
                                                value={exp.description}
                                                onChange={(e) => {
                                                    const newExperience = [
                                                        ...formData.experience,
                                                    ];
                                                    newExperience[
                                                        index
                                                    ].description =
                                                        e.target.value;
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        experience:
                                                            newExperience,
                                                    }));
                                                }}
                                            />
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <Label
                                                        htmlFor={`start-date-${index}`}
                                                    >
                                                        Start Date
                                                    </Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full justify-start text-left font-normal"
                                                                id={`start-date-${index}`}
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {formData
                                                                    .experience[
                                                                    index
                                                                ].startDate ? (
                                                                    format(
                                                                        new Date(
                                                                            formData.experience[
                                                                                index
                                                                            ].startDate
                                                                        ),
                                                                        "PPP"
                                                                    )
                                                                ) : (
                                                                    <span>
                                                                        Pick a
                                                                        date
                                                                    </span>
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                            <Calendar
                                                                mode="single"
                                                                selected={
                                                                    calendarDates[
                                                                        `start-${index}`
                                                                    ]
                                                                }
                                                                onSelect={(
                                                                    date
                                                                ) => {
                                                                    setCalendarDates(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            [`start-${index}`]:
                                                                                date,
                                                                        })
                                                                    );

                                                                    if (date) {
                                                                        const formattedDate =
                                                                            format(
                                                                                date,
                                                                                "yyyy-MM-dd"
                                                                            );
                                                                        const newExperience =
                                                                            [
                                                                                ...formData.experience,
                                                                            ];
                                                                        newExperience[
                                                                            index
                                                                        ].startDate =
                                                                            formattedDate;
                                                                        setFormData(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                experience:
                                                                                    newExperience,
                                                                            })
                                                                        );
                                                                    }
                                                                }}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                                <div>
                                                    <Label
                                                        htmlFor={`end-date-${index}`}
                                                    >
                                                        End Date
                                                    </Label>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full justify-start text-left font-normal"
                                                                id={`end-date-${index}`}
                                                                disabled={
                                                                    exp.isCurrentlyWorking
                                                                }
                                                            >
                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                {formData
                                                                    .experience[
                                                                    index
                                                                ].endDate ? (
                                                                    format(
                                                                        new Date(
                                                                            formData.experience[
                                                                                index
                                                                            ].endDate
                                                                        ),
                                                                        "PPP"
                                                                    )
                                                                ) : (
                                                                    <span>
                                                                        Pick a
                                                                        date
                                                                    </span>
                                                                )}
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0">
                                                            <Calendar
                                                                mode="single"
                                                                selected={
                                                                    calendarDates[
                                                                        `end-${index}`
                                                                    ]
                                                                }
                                                                onSelect={(
                                                                    date
                                                                ) => {
                                                                    setCalendarDates(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            [`end-${index}`]:
                                                                                date,
                                                                        })
                                                                    );

                                                                    if (date) {
                                                                        const formattedDate =
                                                                            format(
                                                                                date,
                                                                                "yyyy-MM-dd"
                                                                            );
                                                                        const newExperience =
                                                                            [
                                                                                ...formData.experience,
                                                                            ];
                                                                        newExperience[
                                                                            index
                                                                        ].endDate =
                                                                            formattedDate;
                                                                        setFormData(
                                                                            (
                                                                                prev
                                                                            ) => ({
                                                                                ...prev,
                                                                                experience:
                                                                                    newExperience,
                                                                            })
                                                                        );
                                                                    }
                                                                }}
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id={`current-job-${index}`}
                                                    checked={
                                                        exp.isCurrentlyWorking
                                                    }
                                                    onCheckedChange={(
                                                        checked
                                                    ) => {
                                                        const newExperience = [
                                                            ...formData.experience,
                                                        ];
                                                        newExperience[
                                                            index
                                                        ].isCurrentlyWorking =
                                                            checked === true;
                                                        if (checked) {
                                                            newExperience[
                                                                index
                                                            ].endDate = "";

                                                            // Clear end date calendar selection
                                                            setCalendarDates(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [`end-${index}`]:
                                                                        undefined,
                                                                })
                                                            );
                                                        }
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            experience:
                                                                newExperience,
                                                        }));
                                                    }}
                                                />
                                                <Label
                                                    htmlFor={`current-job-${index}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    I currently work here
                                                </Label>
                                            </div>
                                            {formData.experience.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => {
                                                        const newExperience =
                                                            formData.experience.filter(
                                                                (_, i) =>
                                                                    i !== index
                                                            );
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            experience:
                                                                newExperience,
                                                        }));
                                                    }}
                                                >
                                                    Delete Experience
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                experience: [
                                                    ...prev.experience,
                                                    {
                                                        title: "",
                                                        description: "",
                                                        startDate: "",
                                                        endDate: "",
                                                        isCurrentlyWorking:
                                                            false,
                                                    },
                                                ],
                                            }));
                                        }}
                                    >
                                        Add Another Experience
                                    </Button>
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
            <div>
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
                                            loading={isSignUpLoading}
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
