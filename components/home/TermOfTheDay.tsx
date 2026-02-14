"use client";
import React, { useState } from 'react';
import GlassCard from '@/components/ui/GlassCard';
import styles from './TermOfTheDay.module.css';

const AI_TERMS = [
    { term: "Neuro-Symbolic AI", definition: "A hybrid approach combining neural networks (learning) with symbolic logic (reasoning). It aims to fix AI \"hallucinations\" by enforcing logical rules." },
    { term: "Transformer", definition: "The architecture behind GPT, BERT, and most modern LLMs. Uses self-attention to process all tokens simultaneously instead of sequentially." },
    { term: "RAG (Retrieval-Augmented Generation)", definition: "Technique that grounds LLM responses in real documents by retrieving relevant data before generating an answer. Reduces hallucinations." },
    { term: "Fine-Tuning", definition: "Training a pre-trained model on a specific dataset to adapt it for a particular task or domain, using much less data than training from scratch." },
    { term: "RLHF", definition: "Reinforcement Learning from Human Feedback — the technique that makes ChatGPT helpful. Humans rank AI outputs, training a reward model." },
    { term: "Mixture of Experts (MoE)", definition: "Architecture where only a subset of neural network parameters activate per input. Used by Mixtral and GPT-4 for efficiency." },
    { term: "Hallucination", definition: "When an AI model generates confident but factually incorrect information. A major challenge in deploying LLMs for critical applications." },
    { term: "Agentic AI", definition: "AI systems that autonomously plan, use tools, and take actions to accomplish complex goals — beyond simple question-answering." },
    { term: "Diffusion Models", definition: "The architecture behind Stable Diffusion and DALL-E. Generates images by learning to reverse a noise-adding process step by step." },
    { term: "Token", definition: "The fundamental unit of text that LLMs process. Words, parts of words, or characters — typically ~4 characters per token in English." },
    { term: "Embedding", definition: "A dense vector representation of data (text, images, audio) in continuous space that captures semantic meaning and relationships." },
    { term: "Zero-Shot Learning", definition: "An AI model performing tasks it was never explicitly trained on, using its general knowledge to generalize to new situations." },
    { term: "Context Window", definition: "The maximum amount of text a model can process at once. GPT-4 supports 128K tokens — roughly 100,000 words." },
    { term: "LoRA", definition: "Low-Rank Adaptation — a parameter-efficient fine-tuning method that trains small adapter layers instead of the full model, saving compute and memory." },
    { term: "Inference", definition: "The process of running a trained model to generate predictions or outputs. Distinct from training, inference is what end-users experience." },
    { term: "Quantization", definition: "Reducing model precision (e.g., from 32-bit to 4-bit) to make AI models smaller and faster while maintaining most of their accuracy." },
    { term: "Multimodal AI", definition: "Models that can understand and generate across multiple data types: text, images, audio, video, and code simultaneously." },
    { term: "Prompt Engineering", definition: "The art of crafting inputs to guide AI models toward desired outputs. Specific, structured prompts yield dramatically better results." },
    { term: "Constitutional AI", definition: "Anthropic's approach to AI safety where the model is trained to follow a set of principles (a 'constitution') to be helpful, harmless, and honest." },
    { term: "Synthetic Data", definition: "Artificially generated training data used when real data is scarce, private, or biased. LLMs can generate training sets for other models." },
    { term: "Knowledge Distillation", definition: "Training a smaller 'student' model to mimic a larger 'teacher' model, producing compact models that retain most of the larger model's capabilities." },
    { term: "Attention Mechanism", definition: "The core innovation of Transformers — allows models to weigh the importance of different parts of the input when generating each output token." },
    { term: "Chain-of-Thought (CoT)", definition: "Prompting technique where the AI reasons step-by-step before answering, significantly improving accuracy on math and logic problems." },
    { term: "Federated Learning", definition: "Training AI models across multiple devices without sharing raw data. Preserves privacy while enabling collaborative model improvement." },
    { term: "Neural Architecture Search (NAS)", definition: "Using AI to automatically design optimal neural network architectures, replacing manual architecture engineering." },
    { term: "Catastrophic Forgetting", definition: "When a neural network forgets previously learned information upon learning new tasks. A key challenge in continual learning." },
    { term: "GAN (Generative Adversarial Network)", definition: "Two neural networks competing: a generator creates fake data while a discriminator tries to detect fakes. The competition improves both." },
    { term: "Tokenizer", definition: "Algorithm that converts raw text into tokens the model can process. BPE (Byte Pair Encoding) is the most common approach in modern LLMs." },
    { term: "GFLOPS", definition: "Giga Floating-Point Operations Per Second — the standard measure of AI hardware performance. Modern GPUs deliver thousands of TFLOPS." },
    { term: "Benchmark", definition: "Standardized tests (MMLU, HumanEval, etc.) used to compare AI model performance. However, 'teaching to the test' is a growing concern." },
];

function getTermIndex(): number {
    // Rotate based on the current day of the year
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000);
    return dayOfYear % AI_TERMS.length;
}

export default function TermOfTheDay() {
    const today = AI_TERMS[getTermIndex()];
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <GlassCard
            className={styles.card}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={styles.label}>Term of the Day</span>
                    <span className={styles.icon}>{isFlipped ? '✕' : '?'}</span>
                </div>

                {!isFlipped ? (
                    <div className={styles.front}>
                        <h3 className={styles.term}>{today.term}</h3>
                        <p className={styles.tapHint}>Tap to explain</p>
                    </div>
                ) : (
                    <div className={styles.back}>
                        <p className={styles.definition}>
                            {today.definition}
                        </p>
                    </div>
                )}
            </div>
        </GlassCard>
    );
}
