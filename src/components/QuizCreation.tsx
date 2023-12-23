'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { quizCreationSchema } from '@/app/schemas/form/quiz';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { BookOpen, CopyCheck } from 'lucide-react';

type Props = {};
const QuizCreation = (props: Props) => {
  const form = useForm<z.infer<typeof quizCreationSchema>>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: 'javascript',
      amount: 3,
      type: 'mcq',
    },
  });

  function onSubmit(values: z.infer<typeof quizCreationSchema>) {
    console.log(values);
  }

  form.watch();

  return (
    <div className="absolute -translate-x-1/2 -transalte-y-1/2 top-0 left-1/2 pt-32 w-10/12 md:w-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a topic" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please provide any topic you would like to be quizzed on
                      here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="How many questions?"
                        type="number"
                        {...field}
                        onChange={(e) => {
                          form.setValue('amount', Number(e.target.value));
                        }}
                        min={1}
                        max={10}
                      />
                    </FormControl>
                    <FormDescription>
                      You can choose how many questions you would like to be
                      quizzed on here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  type="button"
                  className="w-1/2 rounded-none rounded-l-lg"
                  variant={
                    form.getValues('type') === 'mcq' ? 'secondary' : 'default'
                  }
                  onClick={() => {
                    form.setValue('type', 'mcq');
                  }}
                >
                  <CopyCheck className="w-4 h-4 mr-2" />
                  Multiple Choice
                </Button>
                <Separator orientation="vertical" />
                <Button
                  type="button"
                  className="w-1/2 rounded-none rounded-r-lg"
                  variant={
                    form.getValues('type') === 'open_ended'
                      ? 'secondary'
                      : 'default'
                  }
                  onClick={() => {
                    form.setValue('type', 'open_ended');
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Open Ended
                </Button>
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
export default QuizCreation;
