'use server'

import { EventFormData } from "@/app/admin/events/schema";
import * as cheerio from 'cheerio';

interface CodeforcesContest {
    id: number;
    name: string;
    startTimeSeconds: number;
    durationSeconds: number;
}

interface CodeforcesApiResponse {
    status: string;
    result: CodeforcesContest[];
}

interface VJudgeContest {
    title: string;
    begin: number;
    end: number;
}

async function fetchAtCoderContest(contestLink: string): Promise<EventFormData> {
    const response = await fetch(contestLink);
    if (!response.ok) {
        throw new Error('Failed to fetch AtCoder contest');
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('h1.text-center').text().trim();
    const durationText = $('.contest-duration').text();

    // Extract start and end times using regex (2025-02-02 19:00:00+0900)
    const timeRegex = /(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\+\d{4})/g;
    const times = durationText.match(timeRegex);

    if (!times || times.length !== 2) {
        throw new Error('Could not find contest times');
    }

    // Parse times and store as UTC
    const startDate = new Date(times[0].replace(' ', 'T'));
    const endDate = new Date(times[1].replace(' ', 'T'));

    return {
        title,
        description: '',
        startDateTime: startDate.toISOString(),
        endDateTime: endDate.toISOString(),
        type: 'CONTEST',
        status: 'PUBLISHED',
        contestLink: contestLink,
        contestPassword: '',
        openForAttendance: true,
        attendanceScope: 'PUBLIC',
    };
}

export async function fetchContestData(contestLink: string): Promise<{
    error?: string;
    data?: EventFormData;
}> {
    try {
        const url = new URL(contestLink);

        if (url.hostname === 'atcoder.jp') {
            const data = await fetchAtCoderContest(contestLink);
            return { data };
        }

        if (url.hostname === 'codeforces.com') {
            const contestId = url.pathname.split('/')[2];
            if (!contestId) {
                return { error: 'Invalid Codeforces contest URL' };
            }

            const response = await fetch('https://codeforces.com/api/contest.list');
            const data: CodeforcesApiResponse = await response.json();

            if (data.status === 'OK') {
                const contest = data.result.find(c => c.id.toString() === contestId);

                if (contest) {
                    const startDate = new Date(contest.startTimeSeconds * 1000);
                    const endDate = new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000);

                    return {
                        data: {
                            title: contest.name,
                            description: '',
                            startDateTime: startDate.toISOString(),
                            endDateTime: endDate.toISOString(),
                            type: 'CONTEST',
                            status: 'PUBLISHED',
                            contestLink: contestLink,
                            contestPassword: '',
                            openForAttendance: true,
                            attendanceScope: 'PUBLIC',
                        }
                    };
                }
                return { error: 'Contest not found' };
            }
            return { error: 'Failed to fetch contest data from Codeforces' };
        }

        if (url.hostname === 'vjudge.net') {
            const response = await fetch(contestLink);
            const html = await response.text();

            const match = html.match(/<textarea[^>]*name=\"dataJson\"[^>]*>(.*?)<\/textarea>/s);
            if (!match || !match[1]) {
                return { error: 'Contest info not found on VJudge' };
            }

            const contest: VJudgeContest = JSON.parse(match[1]);

            // Store times in UTC
            const startDate = new Date(contest.begin);
            const endDate = new Date(contest.end);

            return {
                data: {
                    title: contest.title,
                    description: '',
                    startDateTime: startDate.toISOString(),
                    endDateTime: endDate.toISOString(),
                    type: 'CONTEST',
                    status: 'PUBLISHED',
                    contestLink: contestLink,
                    contestPassword: '',
                    openForAttendance: true,
                    attendanceScope: 'PUBLIC',
                }
            };
        }

        return { error: 'Unsupported contest platform' };
    } catch (error) {
        console.error('Contest fetch error:', error);
        return { error: 'Failed to fetch contest data' };
    }
}