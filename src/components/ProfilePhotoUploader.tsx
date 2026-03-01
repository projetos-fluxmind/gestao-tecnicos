"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ImagePlus, Loader2 } from "lucide-react";

type ProfilePhotoUploaderProps = {
    name: string;
    initialUrl?: string;
};

export function ProfilePhotoUploader({ name, initialUrl }: ProfilePhotoUploaderProps) {
    const [url, setUrl] = useState(initialUrl ?? "");
    const [preview, setPreview] = useState(initialUrl ?? "");
    const [uploading, setUploading] = useState(false);

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);

            const fileExt = file.name.split(".").pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
            const filePath = `technicians/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("profile-photos")
                .upload(filePath, file);

            if (uploadError) {
                console.error(uploadError);
                alert("Erro ao enviar foto. Tente novamente.");
                return;
            }

            const {
                data: { publicUrl },
            } = supabase.storage.from("profile-photos").getPublicUrl(filePath);

            setUrl(publicUrl);

            const localPreview = URL.createObjectURL(file);
            setPreview(localPreview);
        } catch (error) {
            console.error(error);
            alert("Erro inesperado ao enviar foto.");
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="space-y-3 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 px-1">
                Foto de Perfil
            </label>

            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden">
                    {preview || url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={preview || url} alt="Pré-visualização" className="w-full h-full object-cover" />
                    ) : (
                        <ImagePlus className="text-foreground/30" size={24} />
                    )}
                </div>

                <div className="space-y-2">
                    <label className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest cursor-pointer hover:border-brand-cyan/40 hover:text-brand-cyan transition-all">
                        {uploading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" size={14} />
                                Enviando...
                            </span>
                        ) : (
                            <span>Selecionar arquivo</span>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={uploading}
                        />
                    </label>
                    <p className="text-[11px] text-foreground/40">
                        Imagem será enviada para o storage e usada no perfil.
                    </p>
                </div>
            </div>

            <input type="hidden" name={name} value={url} />
        </div>
    );
}

