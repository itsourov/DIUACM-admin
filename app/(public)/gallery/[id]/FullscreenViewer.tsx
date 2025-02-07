'use client';

import {useEffect, useState, useCallback, useRef} from 'react';
import Image from 'next/image';
import {motion, AnimatePresence} from 'framer-motion';
import {
    X,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    Download,
    Maximize2,
    Minimize2,
    Heart,
    RotateCcw,
    Info
} from 'lucide-react';

interface ImageType {
    id: string;
    url: string;
    alt: string | null;
}

interface FullscreenViewerProps {
    images: ImageType[];
    currentIndex: number | null;
    onClose: () => void;
}

export default function FullscreenViewer({
                                             images,
                                             currentIndex,
                                             onClose
                                         }: FullscreenViewerProps) {
    const [index, setIndex] = useState(currentIndex);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isFavorite, setIsFavorite] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout>();
    const touchStartRef = useRef<{ x: number; y: number }>({x: 0, y: 0});

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(Boolean(document.fullscreenElement));
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const resetControlsTimer = useCallback(() => {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        setShowControls(true);
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 3000);
    }, []);

    useEffect(() => {
        resetControlsTimer();
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [resetControlsTimer]);

    useEffect(() => {
        setIndex(currentIndex);
        setScale(1);
        setRotation(0);
        setLoading(true);
        setError(null);
    }, [currentIndex]);

    const handleNavigate = useCallback((direction: 'next' | 'prev') => {
        if (index === null || images.length <= 1) return;

        setIndex(prev => {
            if (prev === null) return prev;
            if (direction === 'next') {
                return (prev + 1) % images.length;
            }
            return prev === 0 ? images.length - 1 : prev - 1;
        });
    }, [index, images.length]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        resetControlsTimer();
        switch (e.key) {
            case 'Escape':
                if (scale !== 1) {
                    setScale(1);
                    setRotation(0);
                } else {
                    onClose();
                }
                break;
            case 'ArrowLeft':
                handleNavigate('prev');
                break;
            case 'ArrowRight':
                handleNavigate('next');
                break;
            case 'f':
                void toggleFullscreen();
                break;
            default:
                break;
        }
    }, [scale, onClose, handleNavigate, resetControlsTimer]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const toggleFullscreen = async () => {
        try {
            if (!document.fullscreenElement && containerRef.current) {
                await containerRef.current.requestFullscreen();
            } else if (document.fullscreenElement) {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error('Fullscreen error:', err);
        }
    };

    const handleZoom = (type: 'in' | 'out') => {
        setScale(prev => {
            if (type === 'in') return Math.min(prev + 0.25, 3);
            return Math.max(prev - 0.25, 0.5);
        });
    };

    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStartRef.current = {x: touch.clientX, y: touch.clientY};
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touch = e.changedTouches[0];
        const diffX = touch.clientX - touchStartRef.current.x;
        const diffY = touch.clientY - touchStartRef.current.y;

        // Only handle horizontal swipes
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                handleNavigate('prev');
            } else {
                handleNavigate('next');
            }
        }
    };

    if (index === null || !images[index]) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="image-viewer-title"
            onMouseMove={resetControlsTimer}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Header Controls */}
            <AnimatePresence>
                {showControls && (
                    <motion.div
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -20}}
                        transition={{duration: 0.2}}
                        className="absolute top-0 left-0 right-0 z-50"
                    >
                        <div
                            className="flex items-center justify-between p-4 bg-gradient-to-b from-black/70 via-black/50 to-transparent">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsFavorite(!isFavorite)}
                                    className={`p-2 rounded-lg transition-colors ${
                                        isFavorite ? 'text-red-500 hover:text-red-400' : 'text-white/90 hover:text-white'
                                    } hover:bg-white/10`}
                                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                >
                                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`}/>
                                </button>

                                <a
                                    href={images[index].url}
                                    download
                                    className="p-2 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label="Download image"
                                >
                                    <Download className="w-5 h-5"/>
                                </a>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => void toggleFullscreen()}
                                    className="p-2 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                                >
                                    {isFullscreen ? <Minimize2 className="w-5 h-5"/> : <Maximize2 className="w-5 h-5"/>}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label="Close image viewer"
                                >
                                    <X className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Image Container */}
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Navigation Buttons */}
                <AnimatePresence>
                    {showControls && images.length > 1 && (
                        <>
                            <motion.button
                                initial={{opacity: 0, x: -20}}
                                animate={{opacity: 1, x: 0}}
                                exit={{opacity: 0, x: -20}}
                                transition={{duration: 0.2}}
                                onClick={() => handleNavigate('prev')}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white/90 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-all z-20 group"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform"/>
                            </motion.button>

                            <motion.button
                                initial={{opacity: 0, x: 20}}
                                animate={{opacity: 1, x: 0}}
                                exit={{opacity: 0, x: 20}}
                                transition={{duration: 0.2}}
                                onClick={() => handleNavigate('next')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/90 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-all z-20 group"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform"/>
                            </motion.button>
                        </>
                    )}
                </AnimatePresence>

                {/* Main Image */}
                <motion.div
                    key={images[index].id}
                    initial={{opacity: 0}}
                    animate={{
                        opacity: 1,
                        scale,
                        rotate: rotation
                    }}
                    exit={{opacity: 0}}
                    transition={{
                        duration: 0.3,
                        scale: {type: "spring", stiffness: 300, damping: 30}
                    }}
                    className="relative w-full h-full flex items-center justify-center"
                >
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className="w-10 h-10 border-4 border-white/20 border-t-white/100 rounded-full animate-spin"/>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-red-500/20 p-4 rounded-lg flex items-center gap-2 text-white">
                                <Info className="w-5 h-5"/>
                                {error}
                            </div>
                        </div>
                    )}

                    <Image
                        src={images[index].url}
                        alt={images[index].alt || `Image ${index + 1} of ${images.length}`}
                        fill
                        className="object-contain"
                        sizes="100vw"
                        priority
                        onLoad={() => setLoading(false)}
                        onError={() => {
                            setLoading(false);
                            setError('Failed to load image');
                        }}
                    />
                </motion.div>

                {/* Bottom Controls */}
                <AnimatePresence>
                    {showControls && (
                        <motion.div
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: 20}}
                            transition={{duration: 0.2}}
                            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 via-black/50 to-transparent"
                        >
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <button
                                    onClick={() => handleZoom('out')}
                                    className="p-2 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label="Zoom out"
                                    disabled={scale <= 0.5}
                                >
                                    <ZoomOut className="w-5 h-5"/>
                                </button>
                                <span className="text-white/90 min-w-[4rem] text-center">
                  {Math.round(scale * 100)}%
                </span>
                                <button
                                    onClick={() => handleZoom('in')}
                                    className="p-2 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label="Zoom in"
                                    disabled={scale >= 3}
                                >
                                    <ZoomIn className="w-5 h-5"/>
                                </button>
                                <button
                                    onClick={handleRotate}
                                    className="p-2 text-white/90 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                                    aria-label="Rotate image"
                                >
                                    <RotateCcw className="w-5 h-5"/>
                                </button>
                            </div>

                            <div
                                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white/90 text-sm">
                                {index + 1} / {images.length}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}