import {
    Code2, Trophy, Users,
    ChevronRight,
    GraduationCap, Terminal,
    Brain, Timer, MessageSquare,
    CheckCircle2,
    Globe,
    BookOpen, Award, Target,
    FileCode2, Laptop
} from 'lucide-react';
import HeroSection from "@/app/(public)/(homepage)/HeroSection";

const rules = {
    contests: [
        "No external website usage during contests except the platform",
        "Hard copy templates are allowed with specified limits",
        "Code sharing must be enabled on Vjudge contests",
        "Any form of plagiarism results in permanent ban"
    ],
    lab: [
        "Lab access requires regular ACM programmer status",
        "Maintain respectful behavior towards seniors and teachers",
        "Avoid disturbing others during practice sessions",
        "Keep the lab clean and organized"
    ],
    online: [
        "Forum usage prohibited during online contests",
        "Basic resource websites (GFG, CPAlgo) are allowed",
        "Maintain code submission history",
        "Report technical issues immediately"
    ]
};

const programs = [
    {
        title: "Green Sheet Program",
        description: "Master programming basics with our curated problem set covering fundamental concepts. Solve 60% to qualify for Blue Sheet.",
        icon: FileCode2,
        color: "from-green-500 to-emerald-500"
    },
    {
        title: "Blue Sheet Advanced",
        description: "1000+ carefully selected problems for advanced programmers. Regular updates based on top solver performance.",
        icon: Award,
        color: "from-blue-500 to-indigo-500"
    },
    {
        title: "ACM Advanced Camp",
        description: "Intensive training program for TOPC top performers with mentoring from seniors and alumni.",
        icon: Target,
        color: "from-purple-500 to-pink-500"
    }
];

const competitions = [
    {
        title: "Take-Off Programming Contest",
        description: "Semester-based contest series for beginners with mock, preliminary, and main rounds.",
        phases: ["Mock Round", "Preliminary", "Main Contest"],
        eligibility: "1st semester students enrolled in Programming & Problem Solving"
    },
    {
        title: "Unlock The Algorithm",
        description: "Advanced algorithmic contest focusing on data structures and algorithms.",
        phases: ["Mock Round", "Preliminary", "Final Round"],
        eligibility: "Students enrolled in Algorithms course"
    },
    {
        title: "DIU ACM Cup",
        description: "Tournament-style competition to crown the best programmer each semester.",
        phases: ["Group Stage", "Knockouts", "Finals"],
        eligibility: "Top 32 regular programmers"
    }
];

const steps = [
    {
        title: "Master the Green Sheet",
        description: "Complete our curated set of beginner-level problems. Aim for 60% completion to become eligible for the Blue Sheet.",
        icon: BookOpen,
        color: "text-green-500"
    },
    {
        title: "Join Regular Contests",
        description: "Participate in our weekly onsite DIU Individual Contest every Friday and track your progress through our Individual Contest Tracker.",
        icon: Code2,
        color: "text-blue-500"
    },
    {
        title: "Visit ACM Lab",
        description: "Come to KT_310 to meet the community and get help with your competitive programming journey.",
        icon: Users,
        color: "text-purple-500"
    }
];


export default function Homepage() {


    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-sans">

            <HeroSection/>


            {/* What is DIU ACM Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                                What is DIU ACM?
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                DIU ACM is the hub for competitive programming excellence at Daffodil International
                                University. We prepare and send teams to prestigious programming contests including ACM
                                ICPC, fostering a community of problem solvers and algorithmic thinkers.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Team-based learning environment",
                                    "Expert mentorship from seniors",
                                    "Regular contest participation",
                                    "Structured learning paths",
                                ].map((point, index) => (
                                    <li key={index}
                                        className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0"/>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="lg:ml-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                                        <Trophy className="w-8 h-8 text-amber-500 mb-2"/>
                                        <h3 className="font-bold text-gray-900 dark:text-white">Contest Success</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">National & International
                                            achievements</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                                        <Brain className="w-8 h-8 text-purple-500 mb-2"/>
                                        <h3 className="font-bold text-gray-900 dark:text-white">Skill Development</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Structured learning
                                            paths</p>
                                    </div>
                                </div>
                                <div className="space-y-4 mt-8">
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                                        <Users className="w-8 h-8 text-blue-500 mb-2"/>
                                        <h3 className="font-bold text-gray-900 dark:text-white">Community</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Supportive learning
                                            environment</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
                                        <Target className="w-8 h-8 text-red-500 mb-2"/>
                                        <h3 className="font-bold text-gray-900 dark:text-white">ICPC Focus</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Dedicated
                                            preparation</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Programs Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Learning Programs
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Structured paths to excellence in competitive programming
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {programs.map((program, index) => (
                            <div
                                key={index}
                                className="group relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl"
                                />
                                <program.icon
                                    className={`w-12 h-12 mb-6 text-transparent bg-clip-text bg-gradient-to-r ${program.color}`}/>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{program.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{program.description}</p>
                                <a href="#"
                                   className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
                                    Learn more <ChevronRight className="w-4 h-4 ml-1"/>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Competitions Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Our Competitions
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Regular contests to test and improve your skills
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {competitions.map((competition, index) => (
                            <div
                                key={index}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
                            >
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{competition.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">{competition.description}</p>
                                {/* Continuing from the competitions mapping */}
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phases</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {competition.phases.map((phase, i) => (
                                                <span key={i}
                                                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                                                    {phase}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Eligibility</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{competition.eligibility}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Rules Section */}
            <section className="py-20 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Rules & Guidelines
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Essential rules to maintain the integrity of our competitive programming community
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <Trophy className="w-6 h-6 text-amber-500"/>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Contest Rules</h3>
                            </div>
                            <ul className="space-y-4">
                                {rules.contests.map((rule, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0"/>
                                        <span className="text-gray-600 dark:text-gray-400">{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <Laptop className="w-6 h-6 text-blue-500"/>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Lab Rules</h3>
                            </div>
                            <ul className="space-y-4">
                                {rules.lab.map((rule, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0"/>
                                        <span className="text-gray-600 dark:text-gray-400">{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <Globe className="w-6 h-6 text-purple-500"/>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Online Contest
                                    Rules</h3>
                            </div>
                            <ul className="space-y-4">
                                {rules.online.map((rule, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 mt-0.5 text-green-500 flex-shrink-0"/>
                                        <span className="text-gray-600 dark:text-gray-400">{rule}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Training Process Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Training Process
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Our systematic approach to developing competitive programmers
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            {[
                                {
                                    title: "Regular Practice Sessions",
                                    description: "Weekly onsite contests every Friday to maintain consistency",
                                    icon: Timer,
                                    color: "text-blue-500"
                                },
                                {
                                    title: "Trainer Classes",
                                    description: "Specialized sessions on advanced topics by experienced mentors",
                                    icon: GraduationCap,
                                    color: "text-purple-500"
                                },
                                {
                                    title: "Progress Tracking",
                                    description: "Individual Contest Tracker to monitor your growth",
                                    icon: Target,
                                    color: "text-green-500"
                                }
                            ].map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div
                                        className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center">
                                        <item.icon className={`w-6 h-6 ${item.color}`}/>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Path to Success</h3>
                            <div className="space-y-6">
                                {[
                                    {
                                        phase: "Phase 1: Fundamentals",
                                        details: "Master basic programming concepts through Green Sheet problems",
                                        progress: "60% completion required"
                                    },
                                    {
                                        phase: "Phase 2: Advanced Concepts",
                                        details: "Access to Blue Sheet and specialized training",
                                        progress: "Regular participation expected"
                                    },
                                    {
                                        phase: "Phase 3: Competition Ready",
                                        details: "National and International contest preparation",
                                        progress: "Team formation and ICPC training"
                                    }
                                ].map((phase, index) => (
                                    <div key={index} className="relative pl-8 pb-6">
                                        <div
                                            className="absolute left-0 top-0 bottom-0 w-px bg-blue-200 dark:bg-blue-800">
                                            <div
                                                className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500"/>
                                        </div>
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">{phase.phase}</h4>
                                        <p className="text-gray-600 dark:text-gray-400 mb-1">{phase.details}</p>
                                        <span
                                            className="text-sm text-blue-600 dark:text-blue-400">{phase.progress}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-white dark:bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 dark:opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent"/>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <div className="space-y-6">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                                How to Join DIU ACM
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                We don&apos;t have a traditional membership system. Your passion for competitive
                                programming and regular participation makes you a part of our community.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            {steps.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex gap-4 bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl transition-all duration-300 hover:shadow-lg"
                                >
                                    <div className={`${step.color} mt-1`}>
                                        <step.icon className="w-6 h-6"/>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div
                            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold">Get Started Today</h3>
                                <p className="text-blue-100">
                                    Join our Telegram channel to stay updated with contests, events, and connect with
                                    the community.
                                </p>

                                <div className="space-y-4">
                                    <h4 className="font-semibold">What you&apos;ll get:</h4>
                                    <ul className="space-y-3">
                                        {[
                                            "Contest and event updates",
                                            "Access to learning resources",
                                            "Community support",
                                            "Mentorship opportunities"
                                        ].map((benefit, index) => (
                                            <li key={index} className="flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5 text-blue-300"/>
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <button
                                        className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4"/> Join Telegram
                                    </button>
                                    <button
                                        className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                                        <Terminal className="w-4 h-4"/> Visit Lab
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}