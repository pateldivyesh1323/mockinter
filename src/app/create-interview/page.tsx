"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Textarea } from "@/src/app/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/app/components/ui/select";
import { Label } from "@/src/app/components/ui/label";
import { Calendar } from "@/src/app/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/src/app/components/ui/popover";
import { Calendar as CalendarIcon, X, Plus } from "lucide-react";
import { cn } from "@/src/lib/styles/utils";
import { format, parse, setHours, setMinutes } from "date-fns";
import { Badge } from "@/src/app/components/ui/badge";
import { CURRENCIES, TIMEZONES } from "@/src/constants";

type PreferredDateTime = {
    date: Date;
    time: string;
};

export default function CreateNewPage() {
    const router = useRouter();

    const [title, setTitle] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [price, setPrice] = useState<number>(0);
    const [currency, setCurrency] = useState<string>("USD");
    const [jobType, setJobType] = useState<string>("");
    const [experienceLevel, setExperienceLevel] = useState<string>("");
    const [duration, setDuration] = useState<number>(30);
    const [timezone, setTimezone] = useState<string>("UTC");
    const [skillsToFocus, setSkillsToFocus] = useState<string[]>([]);
    const [currentSkill, setCurrentSkill] = useState<string>("");
    const [applicationDeadline, setApplicationDeadline] = useState<
        Date | undefined
    >(undefined);
    const [loading, setLoading] = useState<boolean>(false);

    const [preferredDateTimes, setPreferredDateTimes] = useState<
        PreferredDateTime[]
    >([]);
    const [currentDate, setCurrentDate] = useState<Date | undefined>(undefined);
    const [currentTime, setCurrentTime] = useState<string>("");

    const handleAddSkill = () => {
        if (
            currentSkill.trim() !== "" &&
            !skillsToFocus.includes(currentSkill.trim())
        ) {
            setSkillsToFocus([...skillsToFocus, currentSkill.trim()]);
            setCurrentSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSkillsToFocus(
            skillsToFocus.filter((skill) => skill !== skillToRemove)
        );
    };

    const handleAddDateTime = () => {
        if (currentDate && currentTime) {
            const exists = preferredDateTimes.some(
                (dt) =>
                    format(dt.date, "yyyy-MM-dd") ===
                        format(currentDate, "yyyy-MM-dd") &&
                    dt.time === currentTime
            );

            if (!exists) {
                setPreferredDateTimes([
                    ...preferredDateTimes,
                    { date: currentDate, time: currentTime },
                ]);
                setCurrentTime("");
            }
        }
    };

    const handleRemoveDateTime = (index: number) => {
        setPreferredDateTimes(preferredDateTimes.filter((_, i) => i !== index));
    };

    const getPreferredDatesForAPI = (): Date[] => {
        return preferredDateTimes.map((dt) => {
            const [hours, minutes] = dt.time.split(":").map(Number);
            const date = new Date(dt.date);
            return setMinutes(setHours(date, hours), minutes);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/interviews/createnew", {
                method: "POST",
                body: JSON.stringify({
                    title,
                    description: desc,
                    price,
                    currency,
                    jobType,
                    experienceLevel,
                    duration,
                    timezone,
                    skillsToFocus,
                    applicationDeadline,
                    preferredDate: getPreferredDatesForAPI(),
                }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                router.push("/home");
            } else {
                toast.error(data.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center flex-col">
            <div className="mb-6 font-semibold font-dmsans text-2xl">
                Create new interview
            </div>
            <form
                className="bg-white md:w-[60%] w-[90%] md:p-6 p-4 rounded-lg shadow"
                onSubmit={handleSubmit}
            >
                <div className="mb-6 space-y-2">
                    <Label htmlFor="title" className="text-lg font-semibold">
                        Title
                    </Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        placeholder="Enter interview title"
                    />
                </div>

                <div className="mb-6 space-y-2">
                    <Label
                        htmlFor="description"
                        className="text-lg font-semibold"
                    >
                        Description
                    </Label>
                    <Textarea
                        id="description"
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        required
                        placeholder="Describe the interview details"
                        className="min-h-[150px]"
                    />
                </div>

                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="price"
                            className="text-lg font-semibold"
                        >
                            Price
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="price"
                                type="number"
                                min={0}
                                value={price}
                                onChange={(e) =>
                                    setPrice(Number(e.target.value))
                                }
                                className="w-32"
                            />
                            <Select
                                value={currency}
                                onValueChange={(value) => setCurrency(value)}
                            >
                                <SelectTrigger className="w-[120px]">
                                    <SelectValue placeholder="Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CURRENCIES.map((currency) => (
                                        <SelectItem
                                            key={currency}
                                            value={currency}
                                        >
                                            {currency}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="duration"
                            className="text-lg font-semibold"
                        >
                            Duration (min)
                        </Label>
                        <Input
                            id="duration"
                            type="number"
                            min={15}
                            value={duration}
                            onChange={(e) =>
                                setDuration(Number(e.target.value))
                            }
                            className="w-32"
                            required
                        />
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="jobType"
                            className="text-lg font-semibold"
                        >
                            Job Type
                        </Label>
                        <Select
                            value={jobType}
                            onValueChange={(value) => setJobType(value)}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select job type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Full-time">
                                    Full-time
                                </SelectItem>
                                <SelectItem value="Part-time">
                                    Part-time
                                </SelectItem>
                                <SelectItem value="Contract">
                                    Contract
                                </SelectItem>
                                <SelectItem value="Freelance">
                                    Freelance
                                </SelectItem>
                                <SelectItem value="Internship">
                                    Internship
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="experienceLevel"
                            className="text-lg font-semibold"
                        >
                            Experience Level
                        </Label>
                        <Select
                            value={experienceLevel}
                            onValueChange={(value) => setExperienceLevel(value)}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Entry">Entry</SelectItem>
                                <SelectItem value="Junior">Junior</SelectItem>
                                <SelectItem value="Mid-level">
                                    Mid-level
                                </SelectItem>
                                <SelectItem value="Senior">Senior</SelectItem>
                                <SelectItem value="Lead">Lead</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="mb-6 space-y-2">
                    <Label htmlFor="timezone" className="text-lg font-semibold">
                        Timezone
                    </Label>
                    <Select
                        value={timezone}
                        onValueChange={(value) => setTimezone(value)}
                        required
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                            {TIMEZONES.map((timezone) => (
                                <SelectItem key={timezone} value={timezone}>
                                    {timezone}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Preferred date and time section */}
                <div className="mb-6 space-y-2">
                    <Label
                        htmlFor="preferredDates"
                        className="text-lg font-semibold"
                    >
                        Preferred Dates & Times
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                        <div className="md:col-span-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !currentDate &&
                                                "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {currentDate ? (
                                            format(currentDate, "PPP")
                                        ) : (
                                            <span>Select a date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                >
                                    <Calendar
                                        mode="single"
                                        selected={currentDate}
                                        onSelect={setCurrentDate}
                                        initialFocus
                                        disabled={(date) => date < new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="md:col-span-2">
                            <Input
                                type="time"
                                value={currentTime}
                                onChange={(e) => setCurrentTime(e.target.value)}
                                className="w-full"
                                disabled={!currentDate}
                            />
                        </div>
                        <div>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={handleAddDateTime}
                                disabled={!currentDate || !currentTime}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                            </Button>
                        </div>
                    </div>

                    {preferredDateTimes.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <Label className="text-base">
                                Selected dates and times:
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {preferredDateTimes.map((dt, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="px-3 py-1 flex items-center gap-2"
                                    >
                                        <span>
                                            {format(dt.date, "MMM d, yyyy")} at{" "}
                                            {dt.time}
                                        </span>
                                        <button
                                            type="button"
                                            className="text-xs rounded-full"
                                            onClick={() =>
                                                handleRemoveDateTime(index)
                                            }
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-6 space-y-2">
                    <Label htmlFor="skills" className="text-lg font-semibold">
                        Skills to Focus
                    </Label>
                    <div className="flex gap-2">
                        <Input
                            id="skills"
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddSkill();
                                }
                            }}
                            placeholder="Add a skill"
                        />
                        <Button
                            type="button"
                            onClick={handleAddSkill}
                            variant="secondary"
                        >
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {skillsToFocus.map((skill) => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                {skill}
                                <button
                                    type="button"
                                    className="ml-1 h-4 w-4 rounded-full text-xs font-medium"
                                    onClick={() => handleRemoveSkill(skill)}
                                >
                                    ×
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="mb-6 space-y-2">
                    <Label
                        htmlFor="applicationDeadline"
                        className="text-lg font-semibold"
                    >
                        Application Deadline
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !applicationDeadline &&
                                        "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {applicationDeadline ? (
                                    format(applicationDeadline, "PPP")
                                ) : (
                                    <span>Select a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={applicationDeadline}
                                onSelect={setApplicationDeadline}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/home")}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="relative"
                    >
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-primary/90 rounded">
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        Create
                    </Button>
                </div>
            </form>
        </section>
    );
}
