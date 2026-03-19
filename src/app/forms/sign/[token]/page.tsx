"use client";

import { useState, useRef, useCallback, type MouseEvent, type TouchEvent } from "react";
import {
    Check,
    CheckCircle,
    Edit05,
    Type01,
    Trash01,
    FileCheck02,
} from "@untitledui/icons";

// ── Types ────────────────────────────────────────────────────────────────────

type SignatureTab = "draw" | "type";

interface Point {
    x: number;
    y: number;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ContractSignPage() {
    const [agreed, setAgreed] = useState(false);
    const [signatureTab, setSignatureTab] = useState<SignatureTab>("draw");
    const [typedSignature, setTypedSignature] = useState("");
    const [submitted, setSubmitted] = useState(false);

    // Drawing state
    const [paths, setPaths] = useState<Point[][]>([]);
    const [currentPath, setCurrentPath] = useState<Point[]>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);

    const today = new Date().toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    // ── Drawing Handlers ─────────────────────────────────────────────────────

    const getPoint = useCallback((e: MouseEvent | TouchEvent): Point | null => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return null;

        if ("touches" in e) {
            const touch = e.touches[0];
            if (!touch) return null;
            return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
        }
        return { x: (e as MouseEvent).clientX - rect.left, y: (e as MouseEvent).clientY - rect.top };
    }, []);

    const handlePointerDown = useCallback(
        (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            const pt = getPoint(e);
            if (!pt) return;
            setIsDrawing(true);
            setCurrentPath([pt]);
        },
        [getPoint]
    );

    const handlePointerMove = useCallback(
        (e: MouseEvent | TouchEvent) => {
            if (!isDrawing) return;
            e.preventDefault();
            const pt = getPoint(e);
            if (!pt) return;
            setCurrentPath((prev) => [...prev, pt]);
        },
        [isDrawing, getPoint]
    );

    const handlePointerUp = useCallback(() => {
        if (!isDrawing) return;
        setIsDrawing(false);
        if (currentPath.length > 1) {
            setPaths((prev) => [...prev, currentPath]);
        }
        setCurrentPath([]);
    }, [isDrawing, currentPath]);

    const clearSignature = useCallback(() => {
        setPaths([]);
        setCurrentPath([]);
    }, []);

    const pathToSvg = (points: Point[]): string => {
        if (points.length < 2) return "";
        const start = points[0];
        let d = `M ${start.x} ${start.y}`;
        for (let i = 1; i < points.length; i++) {
            d += ` L ${points[i].x} ${points[i].y}`;
        }
        return d;
    };

    const hasDrawnSignature = paths.length > 0;
    const hasTypedSignature = typedSignature.trim().length > 0;
    const hasSignature = signatureTab === "draw" ? hasDrawnSignature : hasTypedSignature;
    const canSubmit = agreed && hasSignature;

    if (submitted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4">
                <div className="w-full max-w-md text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E2F4A6]/15">
                        <CheckCircle className="size-8 text-[#E2F4A6]" />
                    </div>
                    <h1 className="mt-4 text-2xl font-semibold text-[#FAFAFA]">Agreement Signed</h1>
                    <p className="mt-2 text-sm text-[#A1A1AA]">
                        Your service agreement has been successfully signed and submitted.
                        A copy has been sent to your email.
                    </p>
                    <p className="mt-4 text-xs text-[#71717A]">Signed on {today}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A]">
            {/* Header */}
            <header className="border-b border-[#262626] bg-[#111111]">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 lg:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#5A4EFF]">
                            <FileCheck02 className="size-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#FAFAFA]">Sipho Dlamini</p>
                            <p className="text-xs text-[#A1A1AA]">Personal Training</p>
                        </div>
                    </div>
                    <span className="rounded-full border border-[#262626] bg-[#1A1A1A] px-3 py-1 text-xs font-medium text-[#A1A1AA]">
                        Service Agreement
                    </span>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 py-6 lg:px-6 lg:py-8">
                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <h1 className="text-xl font-semibold text-[#FAFAFA] lg:text-2xl">Service Agreement</h1>
                        <p className="mt-1 text-sm text-[#A1A1AA]">
                            Please review the terms below and sign to confirm your agreement.
                        </p>
                    </div>

                    {/* Contract Content */}
                    <div className="max-h-[480px] overflow-y-auto rounded-2xl border border-[#262626] bg-[#111111] p-5 lg:p-6">
                        <div className="space-y-6">
                            {/* Section 1 */}
                            <section>
                                <h2 className="text-base font-semibold text-[#FAFAFA]">1. Services &amp; Pricing</h2>
                                <div className="mt-2 space-y-2 text-sm leading-relaxed text-[#A1A1AA]">
                                    <p>
                                        The Trainer agrees to provide personal training services as outlined in the selected package.
                                        Sessions are 60 minutes in duration unless otherwise specified. Training sessions include
                                        personalised exercise programming, form correction, motivation, and progress tracking.
                                    </p>
                                    <p>
                                        Pricing is as per the package selected at the time of booking. All prices are quoted in
                                        South African Rand (ZAR) and are inclusive of VAT where applicable. Package rates are
                                        valid for the duration specified and may be subject to annual review.
                                    </p>
                                    <p>
                                        Additional services such as nutrition plans, body composition assessments, and
                                        supplementary group classes may be purchased separately at the rates displayed on the
                                        current price list.
                                    </p>
                                </div>
                            </section>

                            {/* Section 2 */}
                            <section>
                                <h2 className="text-base font-semibold text-[#FAFAFA]">2. Payment Terms</h2>
                                <div className="mt-2 space-y-2 text-sm leading-relaxed text-[#A1A1AA]">
                                    <p>
                                        Payment is due on the 1st of each month for monthly packages, or prior to the first
                                        session for once-off packages. Accepted payment methods include EFT, card payment, and
                                        approved payment platforms.
                                    </p>
                                    <p>
                                        Invoices will be issued electronically. A late payment fee of 2% per month may be applied
                                        to overdue accounts. If payment is not received within 14 days of the due date, services
                                        may be suspended until the account is settled.
                                    </p>
                                    <p>
                                        The Client agrees that the Trainer may use automated reminders for outstanding invoices.
                                        Refunds are only applicable for unused sessions in accordance with the cancellation policy
                                        below.
                                    </p>
                                </div>
                            </section>

                            {/* Section 3 */}
                            <section>
                                <h2 className="text-base font-semibold text-[#FAFAFA]">3. Cancellation Policy</h2>
                                <div className="mt-2 space-y-2 text-sm leading-relaxed text-[#A1A1AA]">
                                    <p>
                                        Individual sessions may be cancelled or rescheduled with a minimum of 24 hours&apos; notice.
                                        Cancellations made with less than 24 hours&apos; notice will be charged at the full session rate.
                                        No-shows will be treated as a completed session.
                                    </p>
                                    <p>
                                        Monthly packages may be paused for a maximum of one calendar month per year with 7 days&apos;
                                        written notice. Early termination of a package requires 30 days&apos; written notice. A
                                        cancellation fee equivalent to one session may apply.
                                    </p>
                                    <p>
                                        The Trainer reserves the right to cancel or reschedule sessions due to illness, emergency,
                                        or unforeseen circumstances. In such cases, a replacement session will be offered at no
                                        additional cost.
                                    </p>
                                </div>
                            </section>

                            {/* Section 4 */}
                            <section>
                                <h2 className="text-base font-semibold text-[#FAFAFA]">4. Liability Waiver</h2>
                                <div className="mt-2 space-y-2 text-sm leading-relaxed text-[#A1A1AA]">
                                    <p>
                                        The Client acknowledges that participation in physical exercise involves inherent risks,
                                        including but not limited to physical injury, muscle strain, or cardiovascular events.
                                        The Client voluntarily assumes all such risks.
                                    </p>
                                    <p>
                                        In accordance with the Consumer Protection Act 68 of 2008 (South Africa), the Client
                                        acknowledges that the Trainer has informed them of potential risks. The Trainer shall
                                        not be liable for any injuries sustained during or as a result of training sessions,
                                        except in cases of gross negligence or wilful misconduct.
                                    </p>
                                    <p>
                                        The Client confirms that they have disclosed any medical conditions, injuries, or
                                        medications that may affect their ability to safely participate in exercise. The Client
                                        agrees to obtain medical clearance if recommended by the Trainer.
                                    </p>
                                </div>
                            </section>

                            {/* Section 5 */}
                            <section>
                                <h2 className="text-base font-semibold text-[#FAFAFA]">5. Data &amp; Privacy (POPIA Consent)</h2>
                                <div className="mt-2 space-y-2 text-sm leading-relaxed text-[#A1A1AA]">
                                    <p>
                                        In terms of the Protection of Personal Information Act 4 of 2013 (POPIA), the Client
                                        consents to the collection, processing, and storage of personal information for the
                                        purpose of providing the agreed services.
                                    </p>
                                    <p>
                                        Personal information collected may include name, contact details, medical history,
                                        fitness assessments, and payment information. This information will be stored securely
                                        and will not be shared with third parties without the Client&apos;s explicit consent,
                                        except where required by law.
                                    </p>
                                    <p>
                                        The Client has the right to request access to, correction of, or deletion of their
                                        personal information at any time by contacting the Trainer directly. Progress photos
                                        and testimonials will only be used for marketing purposes with the Client&apos;s separate
                                        written consent.
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Agreement Checkbox */}
                    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#262626] bg-[#111111] p-4">
                        <div className="pt-0.5">
                            <button
                                type="button"
                                role="checkbox"
                                aria-checked={agreed}
                                onClick={() => setAgreed(!agreed)}
                                className={`flex h-5 w-5 items-center justify-center rounded border transition duration-100 ease-linear ${
                                    agreed
                                        ? "border-[#5A4EFF] bg-[#5A4EFF]"
                                        : "border-[#333333] bg-transparent"
                                }`}
                            >
                                {agreed && <Check className="size-3.5 text-white" />}
                            </button>
                        </div>
                        <span className="text-sm text-[#FAFAFA]">
                            I have read and agree to all terms above
                        </span>
                    </label>

                    {/* Signature Panel */}
                    <div className="rounded-2xl border border-[#262626] bg-[#111111] p-5 lg:p-6">
                        <h3 className="text-base font-semibold text-[#FAFAFA]">Signature</h3>

                        {/* Tabs */}
                        <div className="mt-3 flex gap-1 rounded-lg bg-[#1A1A1A] p-1">
                            <button
                                onClick={() => setSignatureTab("draw")}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                                    signatureTab === "draw"
                                        ? "bg-[#5A4EFF] text-white"
                                        : "text-[#A1A1AA] hover:text-[#FAFAFA]"
                                }`}
                            >
                                <Edit05 className="size-4" /> Draw
                            </button>
                            <button
                                onClick={() => setSignatureTab("type")}
                                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition duration-100 ease-linear ${
                                    signatureTab === "type"
                                        ? "bg-[#5A4EFF] text-white"
                                        : "text-[#A1A1AA] hover:text-[#FAFAFA]"
                                }`}
                            >
                                <Type01 className="size-4" /> Type
                            </button>
                        </div>

                        {/* Draw Tab */}
                        {signatureTab === "draw" && (
                            <div className="mt-4">
                                <div
                                    ref={canvasRef}
                                    onMouseDown={handlePointerDown}
                                    onMouseMove={handlePointerMove}
                                    onMouseUp={handlePointerUp}
                                    onMouseLeave={handlePointerUp}
                                    onTouchStart={handlePointerDown}
                                    onTouchMove={handlePointerMove}
                                    onTouchEnd={handlePointerUp}
                                    className="relative h-[200px] w-full cursor-crosshair rounded-lg border border-dashed border-[#333333] bg-[#0A0A0A] touch-none"
                                >
                                    {!hasDrawnSignature && currentPath.length === 0 && (
                                        <p className="absolute inset-0 flex items-center justify-center text-sm text-[#71717A]">
                                            Sign here
                                        </p>
                                    )}
                                    <svg className="absolute inset-0 h-full w-full">
                                        {paths.map((path, i) => (
                                            <path
                                                key={i}
                                                d={pathToSvg(path)}
                                                fill="none"
                                                stroke="#FAFAFA"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        ))}
                                        {currentPath.length > 1 && (
                                            <path
                                                d={pathToSvg(currentPath)}
                                                fill="none"
                                                stroke="#FAFAFA"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        )}
                                    </svg>
                                </div>
                                <button
                                    onClick={clearSignature}
                                    className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#A1A1AA] transition duration-100 ease-linear hover:text-[#FAFAFA]"
                                >
                                    <Trash01 className="size-4" /> Clear
                                </button>
                            </div>
                        )}

                        {/* Type Tab */}
                        {signatureTab === "type" && (
                            <div className="mt-4">
                                <input
                                    type="text"
                                    placeholder="Type your full name"
                                    value={typedSignature}
                                    onChange={(e) => setTypedSignature(e.target.value)}
                                    className="h-11 w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 text-sm text-[#FAFAFA] placeholder-[#71717A] outline-none transition duration-100 ease-linear focus:border-[#5A4EFF] focus:ring-1 focus:ring-[#5A4EFF]"
                                />
                                {hasTypedSignature && (
                                    <div className="mt-3 flex h-[100px] items-center justify-center rounded-lg border border-dashed border-[#333333] bg-[#0A0A0A]">
                                        <p className="text-3xl italic text-[#FAFAFA]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                                            {typedSignature}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-[#FAFAFA]">Date</label>
                        <input
                            type="text"
                            value={today}
                            readOnly
                            className="h-11 w-full rounded-lg border border-[#262626] bg-[#0A0A0A] px-3 text-sm text-[#A1A1AA] outline-none"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        onClick={() => canSubmit && setSubmitted(true)}
                        disabled={!canSubmit}
                        className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition duration-100 ease-linear ${
                            canSubmit
                                ? "bg-[#5A4EFF] text-white hover:bg-[#4840E8]"
                                : "cursor-not-allowed bg-[#333333] text-[#71717A]"
                        }`}
                    >
                        <Check className="size-4" />
                        Sign &amp; Submit
                    </button>

                    {!agreed && (
                        <p className="text-center text-xs text-[#71717A]">
                            Please agree to the terms and provide your signature to continue.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
