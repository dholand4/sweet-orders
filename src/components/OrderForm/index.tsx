"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BUSINESS_NOTES } from "@/constants/business";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { buildStoreWhatsAppLink, formatCurrencyBRL } from "@/utils/format";
import { orderFormSchema } from "@/utils/validations";
import {
  Aside,
  CepRow,
  ErrorText,
  FeedbackCard,
  FeedbackText,
  FieldShell,
  FieldMessage,
  Form,
  FullWidth,
  Grid,
  InlineMeta,
  Input,
  Label,
  MainColumn,
  NotesCard,
  NotesList,
  NotesTitle,
  PriceBox,
  PriceLabel,
  PriceText,
  PriceValue,
  PrimaryButton,
  RadioCard,
  RadioContent,
  RadioDot,
  RadioGrid,
  RadioText,
  RadioTitle,
  SearchButton,
  Section,
  SectionHeader,
  SectionHeading,
  SectionText,
  SectionTitle,
  Select,
  SelectWrap,
  Shell,
  StepIcon,
  StepLabel,
  SummaryBadge,
  SummaryCard,
  SummaryDescription,
  SummaryFootnote,
  SummaryList,
  SummaryRow,
  SummaryTerm,
  SummaryTitle,
  Textarea,
} from "./style";
import type { OrderFormProps } from "./types";

type OrderFormValues = {
  customerName:      string;
  whatsapp:          string;
  productId:         string;
  productSizeId:     string;
  flavor1Id:         string;
  flavor2Id:         string;
  topping1Id:        string;
  toppingFlavor1Id:  string;
  topping2Id:        string;
  decorationStyleId: string;
  doughType:         "massa_branca" | "massa_chocolate";
  theme:             string;
  themeDescription:  string;
  notes:             string;
  deliveryDate:      string;
  deliveryTime:      string;
  street:            string;
  number:            string;
  district:          string;
  city:              string;
  reference:         string;
  cep:               string;
  wantsTheme:        "nao" | "sim";
};

const defaultValues: OrderFormValues = {
  customerName: "", whatsapp: "",
  productId: "", productSizeId: "",
  flavor1Id: "", flavor2Id: "",
  topping1Id: "", toppingFlavor1Id: "", topping2Id: "",
  decorationStyleId: "",
  doughType: "massa_branca",
  theme: "", themeDescription: "", notes: "",
  deliveryDate: "", deliveryTime: "",
  street: "", number: "", district: "", city: "",
  reference: "", cep: "",
  wantsTheme: "nao",
};

export function OrderForm({ catalog }: OrderFormProps) {
  const router = useRouter();
  const [submitError,      setSubmitError]      = useState("");
  const [cepError,         setCepError]         = useState("");
  const [successMessage,   setSuccessMessage]   = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isLoadingCep,     setIsLoadingCep]     = useState(false);

  const {
    register, watch, setValue, getValues, handleSubmit, reset,
    formState: { errors },
  } = useForm<OrderFormValues>({ resolver: zodResolver(orderFormSchema), defaultValues });

  const selectedProductId     = watch("productId");
  const selectedProductSizeId = watch("productSizeId");
  const wantsTheme            = watch("wantsTheme");

  const selectedProduct   = catalog.products.find((p) => p.id === selectedProductId);
  const filteredSizes     = selectedProduct?.sizes.filter((s) => s.is_active) ?? [];
  const selectedSize      = filteredSizes.find((s) => s.id === selectedProductSizeId);
  const allowedFlavors    = selectedProduct?.allowed_flavors ?? [];
  const allowedToppings   = selectedProduct?.allowed_toppings ?? [];
  const maxFlavors        = selectedProduct?.max_flavors ?? 1;
  const maxToppings       = selectedProduct?.max_toppings ?? 1;
  const hasDoughChoice    = selectedProduct?.allow_dough_choice ?? false;
  const allowedDecoStyles = selectedProduct?.allowed_decoration_styles ?? [];

  const selectedFlavor1        = allowedFlavors.find((f) => f.id === watch("flavor1Id"));
  const selectedFlavor2        = allowedFlavors.find((f) => f.id === watch("flavor2Id"));
  const selectedTopping1       = allowedToppings.find((f) => f.id === watch("topping1Id"));
  const selectedTopping2       = allowedToppings.find((f) => f.id === watch("topping2Id"));
  const selectedToppingFlavor1 = allowedFlavors.find((f) => f.id === watch("toppingFlavor1Id"));
  const selectedDecoStyle      = allowedDecoStyles.find((d) => d.id === watch("decorationStyleId"));
  const selectedDoughType      = watch("doughType");

  const isChantininho   = selectedTopping1?.name.toLowerCase().includes("chantininho") ?? false;
  const showTopping1Flavor = maxToppings >= 1 && !!watch("topping1Id") && !isChantininho;

  const doughTypeLabel = selectedDoughType === "massa_chocolate" ? "Massa de chocolate" : "Massa branca";
  const themeSummary   = wantsTheme === "sim"
    ? watch("themeDescription") || (selectedDecoStyle?.name ?? "Com tema")
    : "Sem tema";

  const flavorsSummary  = [selectedFlavor1?.name, selectedFlavor2?.name].filter(Boolean).join(" + ") || "A definir";
  const toppingsSummary = [selectedTopping1?.name, selectedTopping2?.name].filter(Boolean).join(" + ") || "A definir";

  const decoStyleExtra = selectedDecoStyle?.price_type === "fixed_extra" ? (selectedDecoStyle.price_extra ?? 0) : 0;
  const isNegotiate    = selectedDecoStyle?.price_type === "negotiate";
  const totalEstimate  = selectedSize ? selectedSize.price + decoStyleExtra : undefined;

  function formatCep(value: string) {
    const d = value.replace(/\D/g, "").slice(0, 8);
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
  }

  function formatWhatsApp(value: string) {
    const d = value.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2)  return d ? `(${d}` : "";
    if (d.length <= 7)  return `(${d.slice(0,2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  }

  async function handleCepLookup() {
    const cep = getValues("cep").replace(/\D/g, "");
    if (cep.length !== 8) { setCepError("Informe um CEP válido com 8 números."); return; }
    setCepError("");
    setIsLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = (await res.json()) as { erro?: boolean; logradouro?: string; bairro?: string; localidade?: string };
      if (!res.ok || data.erro) throw new Error("CEP não encontrado.");
      setValue("street",   data.logradouro ?? "", { shouldValidate: true });
      setValue("district", data.bairro ?? "",     { shouldValidate: true });
      setValue("city",     data.localidade ?? "", { shouldValidate: true });
    } catch (e) {
      setCepError(e instanceof Error ? e.message : "Falha ao buscar o CEP.");
    } finally {
      setIsLoadingCep(false);
    }
  }

  async function onSubmit(values: OrderFormValues) {
    setSubmitError("");
    setCepError("");
    setSuccessMessage("");
    setIsSubmittingForm(true);

    const themeValue = values.wantsTheme === "sim" ? values.themeDescription : "";

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, theme: themeValue }),
      });
      const payload = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(payload.message ?? "Não foi possível enviar o pedido.");
      setSuccessMessage(payload.message ?? "Pedido enviado com sucesso!");
      reset(defaultValues);
      router.refresh();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Não foi possível enviar o pedido.");
    } finally {
      setIsSubmittingForm(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register("theme")} />
      <Shell>
        <MainColumn>
          <input type="hidden" {...register("wantsTheme")} />

          {/* Passo 1 */}
          <Section>
            <SectionHeader>
              <StepIcon aria-hidden>1</StepIcon>
              <SectionHeading>
                <StepLabel>Passo 1</StepLabel>
                <SectionTitle>Seus dados</SectionTitle>
                <SectionText>Comece com o básico para identificarmos seu pedido com rapidez.</SectionText>
              </SectionHeading>
            </SectionHeader>
            <Grid>
              <FieldShell>
                <Label htmlFor="customerName">Nome</Label>
                <Input id="customerName" placeholder="Seu nome completo" {...register("customerName")} />
                <FieldMessage>{errors.customerName && <ErrorText>{errors.customerName.message}</ErrorText>}</FieldMessage>
              </FieldShell>
              <FieldShell>
                <Label htmlFor="whatsapp">Telefone / WhatsApp</Label>
                <Input id="whatsapp" placeholder="(88) 99999-9999" inputMode="numeric" maxLength={15}
                  {...register("whatsapp", {
                    onChange: (e) => setValue("whatsapp", formatWhatsApp(e.target.value), { shouldValidate: true }),
                  })} />
                <FieldMessage>{errors.whatsapp && <ErrorText>{errors.whatsapp.message}</ErrorText>}</FieldMessage>
              </FieldShell>
            </Grid>
          </Section>

          {/* Passo 2 */}
          <Section>
            <SectionHeader>
              <StepIcon aria-hidden>2</StepIcon>
              <SectionHeading>
                <StepLabel>Passo 2</StepLabel>
                <SectionTitle>Produto, tamanho e recheio</SectionTitle>
                <SectionText>Escolha o produto, depois o tamanho, os sabores e a cobertura.</SectionText>
              </SectionHeading>
            </SectionHeader>
            <Grid>
              <FieldShell>
                <Label htmlFor="productId">Tipo de bolo ou torta</Label>
                <SelectWrap>
                  <Select id="productId" value={selectedProductId}
                    onChange={(e) => {
                      setValue("productId",         e.target.value, { shouldValidate: true });
                      setValue("productSizeId",      "",             { shouldValidate: true });
                      setValue("flavor1Id",          "",             { shouldValidate: true });
                      setValue("flavor2Id",          "");
                      setValue("topping1Id",         "");
                      setValue("toppingFlavor1Id",   "");
                      setValue("topping2Id",         "");
                      setValue("decorationStyleId",  "");
                    }}>
                    <option value="">Selecione</option>
                    {catalog.products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </Select>
                </SelectWrap>
                <FieldMessage>
                  {errors.productId
                    ? <ErrorText>{errors.productId.message}</ErrorText>
                    : selectedProduct?.description
                    ? <InlineMeta>{selectedProduct.description}</InlineMeta>
                    : null}
                </FieldMessage>
              </FieldShell>

              <FieldShell>
                <Label htmlFor="productSizeId">Tamanho e preço</Label>
                <SelectWrap>
                  <Select id="productSizeId" value={selectedProductSizeId}
                    onChange={(e) => setValue("productSizeId", e.target.value, { shouldValidate: true })}>
                    <option value="">Selecione</option>
                    {filteredSizes.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}{s.servings ? ` (${s.servings})` : ""} — {formatCurrencyBRL(s.price)}
                      </option>
                    ))}
                  </Select>
                </SelectWrap>
                <FieldMessage>
                  {errors.productSizeId
                    ? <ErrorText>{errors.productSizeId.message}</ErrorText>
                    : !selectedProductId
                    ? <InlineMeta>Escolha o produto para ver os tamanhos disponíveis.</InlineMeta>
                    : <FieldMessage />}
                </FieldMessage>
              </FieldShell>

              {/* Sabor 1 */}
              {allowedFlavors.length > 0 && (
                <FieldShell>
                  <Label htmlFor="flavor1Id">
                    {maxFlavors === 2 ? "1º Sabor / Recheio" : "Sabor / Recheio"}
                  </Label>
                  <SelectWrap>
                    <Select id="flavor1Id" {...register("flavor1Id")}>
                      <option value="">Selecione</option>
                      {allowedFlavors.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </Select>
                  </SelectWrap>
                  <FieldMessage>{errors.flavor1Id && <ErrorText>{errors.flavor1Id.message}</ErrorText>}</FieldMessage>
                </FieldShell>
              )}

              {/* Sabor 2 (condicional) */}
              {maxFlavors === 2 && allowedFlavors.length > 0 && (
                <FieldShell>
                  <Label htmlFor="flavor2Id">2º Sabor / Recheio</Label>
                  <SelectWrap>
                    <Select id="flavor2Id" {...register("flavor2Id")}>
                      <option value="">Mesmo do 1º sabor</option>
                      {allowedFlavors.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </Select>
                  </SelectWrap>
                  <FieldMessage />
                </FieldShell>
              )}

              {/* Cobertura 1 */}
              {maxToppings >= 1 && allowedToppings.length > 0 && (
                <FieldShell>
                  <Label htmlFor="topping1Id">
                    {maxToppings === 2 ? "1ª Cobertura / Estilo" : "Cobertura / Estilo"}
                  </Label>
                  <SelectWrap>
                    <Select id="topping1Id"
                      {...register("topping1Id", {
                        onChange: () => setValue("toppingFlavor1Id", ""),
                      })}>
                      <option value="">Selecione</option>
                      {allowedToppings.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </Select>
                  </SelectWrap>
                  <FieldMessage />
                </FieldShell>
              )}

              {/* Sabor da cobertura — oculto para Chantininho */}
              {showTopping1Flavor && (
                <FieldShell>
                  <Label htmlFor="toppingFlavor1Id">Sabor da cobertura</Label>
                  <SelectWrap>
                    <Select id="toppingFlavor1Id" {...register("toppingFlavor1Id")}>
                      <option value="">Selecione o sabor</option>
                      {allowedFlavors.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </Select>
                  </SelectWrap>
                  <FieldMessage />
                </FieldShell>
              )}

              {/* Cobertura 2 (condicional) */}
              {maxToppings === 2 && allowedToppings.length > 0 && (
                <FieldShell>
                  <Label htmlFor="topping2Id">2ª Cobertura / Estilo</Label>
                  <SelectWrap>
                    <Select id="topping2Id" {...register("topping2Id")}>
                      <option value="">Sem 2ª cobertura</option>
                      {allowedToppings.map((f) => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </Select>
                  </SelectWrap>
                  <FieldMessage />
                </FieldShell>
              )}

              {/* Massa (condicional) */}
              {hasDoughChoice && (
                <FieldShell>
                  <Label htmlFor="doughType">Massa do bolo</Label>
                  <SelectWrap>
                    <Select id="doughType" {...register("doughType")}>
                      <option value="massa_branca">Massa branca</option>
                      <option value="massa_chocolate">Massa de chocolate</option>
                    </Select>
                  </SelectWrap>
                  <FieldMessage />
                </FieldShell>
              )}
            </Grid>
          </Section>

          {/* Passo 3 */}
          <Section>
            <SectionHeader>
              <StepIcon aria-hidden>3</StepIcon>
              <SectionHeading>
                <StepLabel>Passo 3</StepLabel>
                <SectionTitle>Tema e acabamento</SectionTitle>
                <SectionText>Se desejar um tema personalizado, defina o estilo e a descrição aqui.</SectionText>
              </SectionHeading>
            </SectionHeader>
            <Grid>
              <FullWidth>
                <FieldShell>
                  <Label>Quer incluir tema?</Label>
                  <RadioGrid>
                    <RadioCard type="button" $active={wantsTheme === "nao"}
                      onClick={() => {
                        setValue("wantsTheme", "nao");
                        setValue("themeDescription", "");
                        setValue("decorationStyleId", "");
                      }}>
                      <RadioDot $active={wantsTheme === "nao"} />
                      <RadioContent>
                        <RadioTitle>Não, quero algo mais clássico</RadioTitle>
                        <RadioText>Sem tema personalizado.</RadioText>
                      </RadioContent>
                    </RadioCard>
                    <RadioCard type="button" $active={wantsTheme === "sim"}
                      onClick={() => setValue("wantsTheme", "sim")}>
                      <RadioDot $active={wantsTheme === "sim"} />
                      <RadioContent>
                        <RadioTitle>Sim, quero tema</RadioTitle>
                        <RadioText>Detalhes especiais podem gerar ajuste no valor final.</RadioText>
                      </RadioContent>
                    </RadioCard>
                  </RadioGrid>
                </FieldShell>
              </FullWidth>

              {wantsTheme === "sim" && (
                <>
                  {/* Estilo decorativo — lado esquerdo */}
                  {allowedDecoStyles.length > 0 && (
                    <FieldShell>
                      <Label htmlFor="decorationStyleId">Estilo decorativo</Label>
                      <SelectWrap>
                        <Select id="decorationStyleId" {...register("decorationStyleId")}>
                          <option value="">Selecione o estilo</option>
                          {allowedDecoStyles.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                              {d.price_type === "fixed_extra" && d.price_extra != null
                                ? ` (+R$${Number(d.price_extra).toFixed(2)})`
                                : d.price_type === "negotiate"
                                ? " (a combinar)"
                                : " (incluso)"}
                            </option>
                          ))}
                        </Select>
                      </SelectWrap>
                      {selectedDecoStyle?.description && (
                        <InlineMeta>{selectedDecoStyle.description}</InlineMeta>
                      )}
                      {isNegotiate && (
                        <InlineMeta style={{ color: "var(--warning, #d97706)", fontWeight: 500 }}>
                          ⚠ Tema 3D — o valor final será combinado pelo WhatsApp após a confirmação.
                        </InlineMeta>
                      )}
                    </FieldShell>
                  )}

                  {/* Descrição do tema — lado direito */}
                  <FieldShell>
                    <Label htmlFor="themeDescription">Descrição do tema</Label>
                    <Textarea id="themeDescription"
                      placeholder="Ex.: nome da aniversariante, paleta de cores, personagem, referências."
                      {...register("themeDescription")} />
                  </FieldShell>
                </>
              )}

              <FullWidth>
                <FieldShell>
                  <Label htmlFor="notes">Observações gerais</Label>
                  <Textarea id="notes" rows={3}
                    placeholder="Ex.: menos doce, sem frutas, entrega em condomínio, observações extras."
                    {...register("notes")} />
                </FieldShell>
              </FullWidth>
            </Grid>
          </Section>

          {/* Passo 4 */}
          <Section>
            <SectionHeader>
              <StepIcon aria-hidden>4</StepIcon>
              <SectionHeading>
                <StepLabel>Passo 4</StepLabel>
                <SectionTitle>Entrega</SectionTitle>
                <SectionText>Informe data, horário e endereço. O CEP pode preencher parte do endereço automaticamente.</SectionText>
              </SectionHeading>
            </SectionHeader>
            <Grid>
              <FieldShell>
                <Label htmlFor="deliveryDate">Data de entrega</Label>
                <Input id="deliveryDate" type="date" {...register("deliveryDate")} />
                <FieldMessage>{errors.deliveryDate && <ErrorText>{errors.deliveryDate.message}</ErrorText>}</FieldMessage>
              </FieldShell>

              <FieldShell>
                <Label htmlFor="deliveryTime">Hora de entrega</Label>
                <Input id="deliveryTime" type="time" {...register("deliveryTime")} />
                <FieldMessage>{errors.deliveryTime && <ErrorText>{errors.deliveryTime.message}</ErrorText>}</FieldMessage>
              </FieldShell>

              <FullWidth>
                <FieldShell>
                  <Label htmlFor="cep">CEP</Label>
                  <CepRow>
                    <Input id="cep" placeholder="00000-000" inputMode="numeric" maxLength={9}
                      {...register("cep", {
                        onChange: (e) => { setCepError(""); setValue("cep", formatCep(e.target.value), { shouldValidate: true }); },
                      })} />
                    <SearchButton type="button" onClick={handleCepLookup} disabled={isLoadingCep}>
                      {isLoadingCep ? "Buscando..." : "Buscar"}
                    </SearchButton>
                  </CepRow>
                  <FieldMessage>{cepError && <ErrorText>{cepError}</ErrorText>}</FieldMessage>
                </FieldShell>
              </FullWidth>

              <FieldShell>
                <Label htmlFor="street">Rua</Label>
                <Input id="street" {...register("street")} />
                <FieldMessage>{errors.street && <ErrorText>{errors.street.message}</ErrorText>}</FieldMessage>
              </FieldShell>

              <FieldShell>
                <Label htmlFor="number">Número</Label>
                <Input id="number" {...register("number")} />
                <FieldMessage>{errors.number && <ErrorText>{errors.number.message}</ErrorText>}</FieldMessage>
              </FieldShell>

              <FieldShell>
                <Label htmlFor="district">Bairro</Label>
                <Input id="district" {...register("district")} />
                <FieldMessage>{errors.district && <ErrorText>{errors.district.message}</ErrorText>}</FieldMessage>
              </FieldShell>

              <FieldShell>
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" {...register("city")} />
                <FieldMessage>{errors.city && <ErrorText>{errors.city.message}</ErrorText>}</FieldMessage>
              </FieldShell>

              <FullWidth>
                <FieldShell>
                  <Label htmlFor="reference">Ponto de referência</Label>
                  <Input id="reference" placeholder="Ex.: próximo à pracinha, bloco B, casa de esquina."
                    {...register("reference")} />
                </FieldShell>
              </FullWidth>
            </Grid>
          </Section>

          <NotesCard>
            <NotesTitle>Antes de enviar</NotesTitle>
            <NotesList>
              {BUSINESS_NOTES.map((note) => <li key={note}>{note}</li>)}
            </NotesList>
          </NotesCard>
        </MainColumn>

        {/* Sidebar de resumo */}
        <Aside>
          <SummaryCard>
            <div>
              <SummaryBadge>Resumo do pedido</SummaryBadge>
              <SummaryTitle>Seu bolo</SummaryTitle>
            </div>

            <SummaryList>
              <SummaryRow>
                <SummaryTerm>Produto</SummaryTerm>
                <SummaryDescription>{selectedProduct?.name ?? "A definir"}</SummaryDescription>
              </SummaryRow>
              <SummaryRow>
                <SummaryTerm>Tamanho</SummaryTerm>
                <SummaryDescription>{selectedSize?.name ?? "A definir"}</SummaryDescription>
              </SummaryRow>
              <SummaryRow>
                <SummaryTerm>{maxFlavors === 2 ? "Recheios" : "Recheio"}</SummaryTerm>
                <SummaryDescription>{flavorsSummary}</SummaryDescription>
              </SummaryRow>
              {maxToppings > 0 && (
                <SummaryRow>
                  <SummaryTerm>{maxToppings === 2 ? "Coberturas" : "Cobertura"}</SummaryTerm>
                  <SummaryDescription>{toppingsSummary}</SummaryDescription>
                </SummaryRow>
              )}
              {showTopping1Flavor && (
                <SummaryRow>
                  <SummaryTerm>Sabor da cobertura</SummaryTerm>
                  <SummaryDescription>{selectedToppingFlavor1?.name ?? "A definir"}</SummaryDescription>
                </SummaryRow>
              )}
              {hasDoughChoice && (
                <SummaryRow>
                  <SummaryTerm>Massa</SummaryTerm>
                  <SummaryDescription>{doughTypeLabel}</SummaryDescription>
                </SummaryRow>
              )}
              <SummaryRow>
                <SummaryTerm>Tema</SummaryTerm>
                <SummaryDescription>{themeSummary}</SummaryDescription>
              </SummaryRow>
              {wantsTheme === "sim" && selectedDecoStyle && (
                <SummaryRow>
                  <SummaryTerm>Estilo decorativo</SummaryTerm>
                  <SummaryDescription>
                    {selectedDecoStyle.price_type === "negotiate"
                      ? `${selectedDecoStyle.name} (a combinar)`
                      : selectedDecoStyle.name}
                  </SummaryDescription>
                </SummaryRow>
              )}
            </SummaryList>

            <PriceBox>
              <PriceLabel>Valor estimado</PriceLabel>
              <PriceValue>
                {isNegotiate
                  ? `${formatCurrencyBRL(selectedSize?.price)} + a combinar`
                  : formatCurrencyBRL(totalEstimate)}
              </PriceValue>
              <PriceText>
                {decoStyleExtra > 0
                  ? `Base ${formatCurrencyBRL(selectedSize?.price)} + estilo ${formatCurrencyBRL(decoStyleExtra)}. Ajustes finais no WhatsApp.`
                  : isNegotiate
                  ? "O valor do estilo 3D será combinado após a confirmação."
                  : "Valor base. Ajustes finais são combinados no WhatsApp."}
              </PriceText>
            </PriceBox>

            <PrimaryButton type="submit" disabled={isSubmittingForm}>
              {isSubmittingForm ? "Enviando pedido..." : "Enviar solicitação"}
            </PrimaryButton>

            <SummaryFootnote>
              Você será direcionado(a) ao WhatsApp da confeitaria para a confirmação final.
            </SummaryFootnote>

            {submitError && <ErrorText>{submitError}</ErrorText>}

            {successMessage && (
              <FeedbackCard>
                <FeedbackText>{successMessage}</FeedbackText>
                <WhatsAppButton
                  href={buildStoreWhatsAppLink(
                    "Olá! Acabei de enviar meu pedido pelo site da Dany Ruivo e gostaria de acompanhar a confirmação.",
                  )}
                  label="Chamar a loja no WhatsApp"
                />
              </FeedbackCard>
            )}
          </SummaryCard>
        </Aside>
      </Shell>
    </Form>
  );
}
