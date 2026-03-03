"use client";
import React, { useState, useEffect, use } from 'react';
import styles from './page.module.css';
import StatusBadge from '@/components/admin/StatusBadge';
import { useRouter } from 'next/navigation';
import { fetchArticleById, saveArticleAction } from '@/app/actions/articles';
import { processArticleWithAI } from '@/app/actions/ai';
import { generateArticleImage } from '@/app/actions/images';
import { Article } from '@/types';

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [article, setArticle] = useState<Article | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isProcessingAI, setIsProcessingAI] = useState(false);
    const [isGeneratingImg, setIsGeneratingImg] = useState(false);
    const [imgStatus, setImgStatus] = useState<string>('');

    useEffect(() => {
        const load = async () => {
            const data = await fetchArticleById(id);
            if (data) {
                setArticle(data);
            }
        };
        load();
    }, [id]);

    const handleSave = async (updatedFields: Partial<Article>) => {
        if (!article) return;
        const updated = { ...article, ...updatedFields };
        setArticle(updated);
        await saveArticleAction(updated);
    };

    const handleAIProcess = async () => {
        if (!article) return;
        setIsProcessingAI(true);
        const result = await processArticleWithAI(article);
        if (result.success && result.article) {
            setArticle(result.article);
        } else {
            alert("AI Error: Check console for details (Possibly missing API Key).");
        }
        setIsProcessingAI(false);
    };

    const handleGenerateImage = async () => {
        if (!article) return;
        setIsGeneratingImg(true);
        setImgStatus('Generating AI prompt...');

        const result = await generateArticleImage(
            article.id,
            article.contentEn,
            article.imagePrompt || undefined
        );

        if (result.success && result.imageUrl) {
            setArticle(prev => prev ? {
                ...prev,
                imageUrl: result.imageUrl,
                imagePrompt: result.imagePrompt || prev.imagePrompt,
            } : prev);
            setImgStatus('✅ Image generated & saved!');
        } else {
            // Even if image generation failed, save the prompt for later retry
            if (result.imagePrompt) {
                setArticle(prev => prev ? {
                    ...prev,
                    imagePrompt: result.imagePrompt || prev.imagePrompt,
                } : prev);
            }
            setImgStatus(`⚠️ ${result.error || 'Generation failed'}`);
        }

        setIsGeneratingImg(false);
        setTimeout(() => setImgStatus(''), 8000);
    };

    const handleApprove = async () => {
        if (!article) return;
        setIsSaving(true);
        await saveArticleAction({ ...article, status: 'published' });
        setIsSaving(false);
        router.push('/admin/dashboard');
    };

    if (!article) return <div className={styles.container}>Loading Article...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <span className={styles.backLink} onClick={() => router.back()}>← Back to Dashboard</span>
                    <h1 className={styles.title}>Editor: {article.titleEn}</h1>
                </div>
                <div className={styles.actions}>
                    <button className={styles.aiBtn} onClick={handleAIProcess} disabled={isProcessingAI}>
                        {isProcessingAI ? 'AI Working...' : '✨ Magic AI Process'}
                    </button>
                    <StatusBadge status={article.status} />
                    <button className={styles.approveBtn} onClick={handleApprove} disabled={isSaving}>
                        {isSaving ? 'Publishing...' : 'Approve & Publish'}
                    </button>
                </div>
            </header>

            <div className={styles.editorGrid}>
                <div className={styles.editorContainer}>
                    <div className={styles.panel}>
                        <h2 className={styles.panelTitle}>English Content</h2>
                        <textarea
                            className={styles.textarea}
                            value={article.contentEn}
                            onChange={(e) => handleSave({ contentEn: e.target.value })}
                        />
                    </div>

                    <div className={styles.panel}>
                        <div className={styles.panelHeader}>
                            <h2 className={styles.panelTitle}>Romanian Translation (AI)</h2>
                            <span className={styles.badge}>Editable</span>
                        </div>
                        <textarea
                            className={styles.textarea}
                            value={article.contentRo}
                            onChange={(e) => handleSave({ contentRo: e.target.value })}
                        />
                    </div>
                </div>

                <div className={styles.extras}>
                    <div className={styles.extraPanel}>
                        <h3 className={styles.extraTitle}>AIPress Editorial Take (RO)</h3>
                        <textarea
                            className={styles.shortInput}
                            value={article.aiTakeRo}
                            onChange={(e) => handleSave({ aiTakeRo: e.target.value })}
                        />
                    </div>

                    <div className={styles.extraPanel}>
                        <div className={styles.panelHeader}>
                            <h3 className={styles.extraTitle}>Featured Image</h3>
                            <button className={styles.genBtn} onClick={handleGenerateImage} disabled={isGeneratingImg}>
                                {isGeneratingImg ? '🎨 Generating...' : '🖼️ Generate & Save'}
                            </button>
                        </div>

                        {imgStatus && (
                            <div style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                background: imgStatus.startsWith('✅') ? 'rgba(0,200,100,0.1)' : imgStatus.startsWith('⚠') ? 'rgba(255,140,0,0.1)' : 'rgba(0,209,255,0.1)',
                                color: imgStatus.startsWith('✅') ? '#00c864' : imgStatus.startsWith('⚠') ? '#FF8C00' : '#00D1FF',
                                fontSize: '12px',
                                marginBottom: '12px',
                            }}>
                                {imgStatus}
                            </div>
                        )}

                        {/* Show saved image from Supabase Storage */}
                        {article.imageUrl && (
                            <div className={styles.imagePreview}>
                                <img
                                    src={article.imageUrl}
                                    alt="Article Featured Image"
                                    className={styles.previewImg}
                                />
                                <div className={styles.imageOverlay}>Stored in Supabase ✓</div>
                            </div>
                        )}

                        <textarea
                            className={styles.promptInput}
                            value={article.imagePrompt || ''}
                            onChange={(e) => handleSave({ imagePrompt: e.target.value })}
                            placeholder="AI image prompt will appear here. You can edit it before generating."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
