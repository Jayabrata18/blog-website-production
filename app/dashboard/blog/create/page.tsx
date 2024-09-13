"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { EyeOpenIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { Switch } from "@/components/ui/switch";
import { RocketIcon, StarIcon } from "lucide-react";
import { BsSave } from "react-icons/bs";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import MarkdownPreview from "@/components/markdown/MarkdownPreview";

const FormSchema = z
    .object({
        title: z.string().min(2, {
            message: "Title must be at least 2 characters."
        }),
        image_url: z.string().url({
            message: "Invalid URL"
        }),
        content: z.string().min(10, {
            message: "Content must be at least 10 characters."
        }),
        isPremium: z.boolean(),
        isPublished: z.boolean()
    })
    .refine(
        (data) => {
            const image_url = data.image_url;
            try {
                const url = new URL(image_url);
                return url.hostname === "image.unsplash.com";
            } catch {
                return false;
            }
        },
        {
            message: "Invalid image URL. Please use an image from Unsplash.",
            path: ["image_url"]
        }
    );

export default function BlogForm() {
    const [isPreview, setPreview] = useState(false);
    const form = useForm<z.infer<typeof FormSchema>>({
        mode: "all",
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            content: "",
            image_url: "",
            isPremium: false,
            isPublished: false
        }
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            )
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full border rounded-md space-y-6 pb-10">
                <div className="p-5 flex items-center flex-wrap justify-between border-b gap-5">
                    <div className="flex gap-5 items-center flex-wrap">
                        <span
                            role="button"
                            tabIndex={0}
                            className="flex items-center gap-1 border bg-zinc-700 p-2 rounded-md hover:ring-2 hover:ring-zinc-400 transition-all"
                            onClick={() => setPreview(!isPreview 
                                // && 
                                // !form.getFieldState("image_url").invalid
                            )}
                        >
                            {isPreview ? (
                                <>
                                    <Pencil1Icon />
                                    Edit
                                </>
                            ) : (
                                <>
                                    <EyeOpenIcon />
                                    Preview
                                </>
                            )}
                        </span>
                        <FormField
                            control={form.control}
                            name="isPremium"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center gap-1 border bg-zinc-700 p-2 rounded-md hover:ring-2 hover:ring-zinc-400 transition-all">
                                            <StarIcon />
                                            <span>Premium</span>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isPublished"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center gap-1 border bg-zinc-700 p-2 rounded-md hover:ring-2 hover:ring-zinc-400 transition-all">
                                            <RocketIcon />
                                            <span>Publish</span>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button className="flex items-center gap-1" disabled={!form.formState.isValid}>
                        <BsSave />
                        Save
                    </Button>
                </div>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel></FormLabel>
                            <FormControl>
                                <div className={cn("p-2 w-full flex break-words gap-2", isPreview ? "divide-x-0" : "divide-x")}>
                                    <Input
                                        placeholder="title"
                                        {...field}
                                        className={cn("border-none text-lg font-medium leading-relaxed", isPreview ? "w-0 p-0" : "w-full lg:w-1/2")}
                                    />
                                    <div className={cn("lg:px-10", isPreview ? "mx-auto w-full lg:w-4/5" : "w-1/2 lg:block hidden")}>
                                        <h1 className="text-3xl font-medium">{form.getValues().title}</h1>
                                    </div>
                                </div>
                            </FormControl>
                            {form.getFieldState("title").invalid && form.getValues().title && <FormMessage />}
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel></FormLabel>
                            <FormControl>
                                <div className={cn("p-2 w-full flex break-words gap-2", isPreview ? "divide-x-0" : "divide-x")}>
                                    <Input
                                        placeholder="image url"
                                        {...field}
                                        className={cn("border-none text-lg font-medium leading-relaxed", isPreview ? "w-0 p-0" : "w-full lg:w-1/2")}
                                    />
                                    <div className={cn("lg:px-10", isPreview ? "mx-auto w-full lg:w-4/5" : "w-1/2 lg:block hidden")}>
                                        {!isPreview ? (
                                            <>
                                                <p>Click on Preview to see</p>
                                            </>
                                        ) : (
                                            <div className="relative h-80 mt-5 border rounded-md">
                                                <Image
                                                    src={form.getValues().image_url}
                                                    alt="preview"
                                                    fill
                                                    className="object-cover object-center rounded-md"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </FormControl>
                            {form.getFieldState("image_url").invalid && form.getValues().image_url && (
                                <div className="p-2">
                                    <FormMessage />
                                </div>
                            )}

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel></FormLabel>
                            <FormControl>
                                <div className={cn("p-2 w-full flex break-words gap-2", isPreview ? "divide-x-0 " : "divide-x h-70vh")}>
                                    <Textarea
                                        placeholder="content"
                                        {...field}
                                        className={cn(
                                            "border-none text-lg font-medium leading-relaxed resize-none ",
                                            isPreview ? "w-0 p-0" : "w-full lg:w-1/2"
                                        )}
                                    />
                                    <div className={cn("overflow-y-auto", isPreview ? "mx-auto w-full lg:w-4/5" : "w-1/2 lg:block hidden")}>
                                        <MarkdownPreview content={form.getValues().content} />
                                    </div>
                                </div>
                            </FormControl>
                            {form.getFieldState("content").invalid && form.getValues().content && <FormMessage />}

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
