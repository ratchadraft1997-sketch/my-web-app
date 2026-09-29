"use client";

import { useState } from "react";
import { X, Plus, Sparkles } from "lucide-react";
import { useTrips } from "@/lib/hooks/useTrips";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripCreated?: (tripId: string) => void;
}

const DURATION_PRESETS = [
  "1 วัน (Day Trip)",
  "2 วัน 1 คืน",
  "3 วัน 2 คืน",
  "ครึ่งวัน (Half Day)",
];

export function CreateTripModal({ isOpen, onClose, onTripCreated }: CreateTripModalProps) {
  const { createTrip } = useTrips();
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("1 วัน (Day Trip)");
  const [description, setDescription] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTrip = createTrip(title, description, duration);
    setTitle("");
    setDescription("");
    onClose();
    if (onTripCreated) {
      onTripCreated(newTrip.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">สร้างทริปใหม่</h2>
              <p className="text-[11px] text-slate-500">วางแผนและจัดตารางท่องเที่ยวนครนายก</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <Input
            label="ชื่อทริปท่องเที่ยว *"
            placeholder="เช่น เที่ยวเขาช่องลม ลุยน้ำตก 1 วัน"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">ระยะเวลาการท่องเที่ยว</label>
            <div className="flex flex-wrap gap-2">
              {DURATION_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setDuration(preset)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    duration === preset
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">คำอธิบายเพิ่มเติม / หมายเหตุ</label>
            <textarea
              className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              rows={3}
              placeholder="เช่น ทริปครอบครัว เน้นเล่นน้ำและถ่ายรูปคาเฟ่"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 text-xs"
            >
              ยกเลิก
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={!title.trim()}
              className="flex-1 h-11 text-xs shadow-md"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>สร้างทริป</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

