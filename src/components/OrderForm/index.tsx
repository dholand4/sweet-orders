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
  customerName: string;
  whatsapp: string;
  productTypeId: string;
  productSizeId: string;
  flavorId: string;
  fillingId: string;
  toppingId: string;
  doughType: "massa_branca" | "massa_chocolate";
  theme: string;
  notes: string;
  deliveryDate: string;
  deliveryTime: string;
  street: string;
  number: string;
  district: string;
  city: string;
  reference: string;
  cep: string;
  wantsTheme: "nao" | "sim";
  themeStyle: string;
  themeDescription: string;
};

const defaultValues: OrderFormValues = {
  customerName: "",
  whatsapp: "",
  productTypeId: "",
  productSizeId: "",
  flavorId: "",
  fillingId: "",
  toppingId: "",
  doughType: "massa_branca",
  theme: "",
  notes: "",
  deliveryDate: "",
  deliveryTime: "",
  street: "",
  number: "",
  district: "",
  city: "",
  reference: "",
  cep: "",
  wantsTheme: "nao",
  themeStyle: "",
  themeDescription: "",
};

export function OrderForm({ options }: OrderFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState("");
  const [cepError, setCepError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const {
    register,
    watch,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues,
  });

  const selectedProductTypeId = watch("productTypeId");
  const selectedProductSizeId = watch("productSizeId");
  const wantsTheme = watch("wantsTheme");
  const filteredSizes = options.productSizes.filter(
    (size) => size.product_type_id === selectedProductTypeId,
  );
  const selectedSize = filteredSizes.find((size) => size.id === selectedProductSizeId);
  const selectedProductType = options.productTypes.find(
    (product) => product.id === selectedProductTypeId,
  );
  const selectedFlavor = options.flavors.find((flavor) => flavor.id === watch("flavorId"));
  const selectedFilling = options.fillings.find((filling) => filling.id === watch("fillingId"));
  const selectedTopping = options.toppings.find((topping) => topping.id === watch("toppingId"));
  const selectedDoughType = watch("doughType");
  const themeSummary =
    wantsTheme === "sim"
      ? [watch("themeStyle"), watch("themeDescription")].filter(Boolean).join(" - ") || "Com tema"
      : "Sem tema";
  const doughTypeLabel =
    selectedDoughType === "massa_chocolate" ? "Massa de chocolate" : "Massa branca";

  function formatCep(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);

    if (digits.length <= 5) {
      return digits;
    }

    return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  }

  function formatWhatsApp(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (digits.length <= 2) {
      return digits ? `(${digits}` : "";
    }

    if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  async function handleCepLookup() {
    const cep = getValues("cep").replace(/\D/g, "");

    if (cep.length !== 8) {
      setCepError("Informe um CEP valido com 8 numeros.");
      return;
    }

    setCepError("");
    setIsLoadingCep(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const payload = (await response.json()) as {
        erro?: boolean;
        logradouro?: string;
        bairro?: string;
        localidade?: string;
      };

      if (!response.ok || payload.erro) {
        throw new Error("Nao foi possivel localizar esse CEP.");
      }

      setValue("street", payload.logradouro ?? "", { shouldValidate: true });
      setValue("district", payload.bairro ?? "", { shouldValidate: true });
      setValue("city", payload.localidade ?? "", { shouldValidate: true });
    } catch (error) {
      setCepError(error instanceof Error ? error.message : "Falha ao buscar o CEP.");
    } finally {
      setIsLoadingCep(false);
    }
  }

  async function onSubmit(values: OrderFormValues) {
    setSubmitError("");
    setCepError("");
    setSuccessMessage("");
    setIsSubmittingForm(true);

    const themeValue =
      values.wantsTheme === "sim"
        ? [values.themeStyle, values.themeDescription].filter(Boolean).join(" - ")
        : "";
    const notesValue = [
      `Massa do bolo: ${values.doughType === "massa_chocolate" ? "Massa de chocolate" : "Massa branca"}`,
      values.notes,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          theme: themeValue,
          notes: notesValue,
        }),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(payload.message || "Nao foi possivel enviar o pedido.");
      }

      setSuccessMessage(
        payload.message ||
          "Pedido enviado com sucesso! A Dany Ruivo ira confirmar pelo WhatsApp.",
      );
      reset(defaultValues);
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Nao foi possivel enviar o pedido.",
      );
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

          <Section>
            <SectionHeader>
              <StepIcon aria-hidden>1</StepIcon>
              <SectionHeading>
                <StepLabel>Passo 1</StepLabel>
                <SectionTitle>Seus dados</SectionTitle>
                <SectionText>
                  Comece com o basico para a equipe identificar seu pedido com rapidez.
                </SectionText>
              </SectionHeading>
            </SectionHeader>

            <Grid>
              <FieldShell>
                <Label htmlFor="customerName">Nome</Label>
                <Input
                  id="customerName"
                  placeholder="Seu nome completo"
                  {...register("customerName")}
                />
                <FieldMessage>
                  {errors.customerName ? <ErrorText>{errors.customerName.message}</ErrorText> : null}
                </FieldMessage>
              </FieldShell>

              <FieldShell>
                <Label htmlFor="whatsapp">Telefone / WhatsApp</Label>
                <Input
                  id="whatsapp"
                  placeholder="(88) 99999-9999"
                  inputMode="numeric"
                  maxLength={15}
                  {...register("whatsapp", {
                    onChange: (event) => {
                      setValue("whatsapp", formatWhatsApp(event.target.value), {
                        shouldValidate: true,
                      });
                    },
                  })}
                />
                <FieldMessage>
                  {errors.whatsapp ? <ErrorText>{errors.whatsapp.message}</ErrorText> : null}
                </FieldMessage>
              </FieldShell>
            </Grid>
          </Section>

          <Section>
            <SectionHeader>
              <StepIcon aria-hidden>2</StepIcon>
              <SectionHeading>
                <StepLabel>Passo 2</StepLabel>
                <SectionTitle>Bolo, tamanho e recheio</SectionTitle>
                <SectionText>
                  Escolha primeiro o tipo do produto, depois o tamanho, sabor,
                  recheio e a cobertura base.
                </SectionText>
              </SectionHeading>
            </SectionHeader>

            <Grid>
              <FieldShell>
                <Label htmlFor="productTypeId">Tipo de bolo ou torta</Label>
                <SelectWrap>
                  <Select
                    id="productTypeId"
                    value={selectedProductTypeId}
                    onChange={(event) => {
                      setValue("productTypeId", event.target.value, { shouldValidate: true });
                      setValue("productSizeId", "", { shouldValidate: true });
                    }}
                  >
                    <option value="">Selecione</option>
                    {options.productTypes.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </Select>
                </SelectWrap>
                <FieldMessage>
                  {errors.productTypeId ? <ErrorText>{errors.productTypeId.message}</ErrorText> : null}
                </FieldMessage>
              </FieldShell>

              <FieldShell>
                <Label htmlFor="productSizeId">Tamanho e preco</Label>
                <SelectWrap>
                  <Select
                    id="productSizeId"
                    value={selectedProductSizeId}
                    onChange={(event) =>
                      setValue("productSizeId", event.target.value, { shouldValidate: true })
                    }
                  >
                    <option value="">Selecione</option>
                    {filteredSizes.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name} - {formatCurrencyBRL(option.price)}
                      </option>
                    ))}
                  </Select>
                </SelectWrap>
                {errors.productSizeId ? (
                  <FieldMessage>
                    <ErrorText>{errors.productSizeId.message}</ErrorText>
                  </FieldMessage>
                ) : !selectedProductTypeId ? (
                  <FieldMessage>
                    <InlineMeta>Escolha primeiro o tipo para liberar os tamanhos disponiveis.</InlineMeta>
                  </FieldMessage>
                ) : (
                  <FieldMessage />
                )}
              </FieldShell>

              <FieldShell>
                <Label htmlFor="flavorId">Sabor</Label>
                <SelectWrap>
                  <Select id="flavorId" {...register("flavorId")}>
                    <option value="">Selecione</option>
                    {options.flavors.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </Select>
                </SelectWrap>
                <FieldMessage>
                  {errors.flavorId ? <ErrorText>{errors.flavorId.message}</ErrorText> : null}
                </FieldMessage>
              </FieldShell>

              <FieldShell>
                <Label htmlFor="fillingId">Recheio</Label>
                <SelectWrap>
                  <Select id="fillingId" {...register("fillingId")}>
                    <option value="">Selecione</option>
                    {options.fillings.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </Select>
                </SelectWrap>
                <FieldMessage>
                  {errors.fillingId ? <ErrorText>{errors.fillingId.message}</ErrorText> : null}
                </FieldMessage>
              </FieldShell>

              <FieldShell>
                <Label htmlFor="toppingId">Cobertura</Label>
                <SelectWrap>
                  <Select id="toppingId" {...register("toppingId")}>
                    <option value="">Selecione</option>
                    {options.toppings.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </Select>
                </SelectWrap>
                <FieldMessage>
                  {errors.toppingId ? <ErrorText>{errors.toppingId.message}</ErrorText> : null}
                </FieldMessage>
              </FieldShell>

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
            </Grid>
          </Section>

          <Section>
            <SectionHeader>
              <StepIcon aria-hidden>3</StepIcon>
              <SectionHeading>
                <StepLabel>Passo 3</StepLabel>
                <SectionTitle>Tema e acabamento</SectionTitle>
                <SectionText>
                  Se desejar um tema personalizado, o estilo dele fica definido aqui,
                  separado da cobertura do bolo.
                </SectionText>
              </SectionHeading>
            </SectionHeader>

            <Grid>
              <FullWidth>
                <FieldShell>
                  <Label>Quer incluir tema?</Label>
                  <RadioGrid>
                    <RadioCard
                      type="button"
                      $active={wantsTheme === "nao"}
                      onClick={() => {
                        setValue("wantsTheme", "nao");
                        setValue("themeStyle", "");
                        setValue("themeDescription", "");
                      }}
                    >
                      <RadioDot $active={wantsTheme === "nao"} />
                      <RadioContent>
                        <RadioTitle>Nao, quero algo mais classico</RadioTitle>
                        <RadioText>Sem tema personalizado.</RadioText>
                      </RadioContent>
                    </RadioCard>

                    <RadioCard
                      type="button"
                      $active={wantsTheme === "sim"}
                      onClick={() => setValue("wantsTheme", "sim")}
                    >
                      <RadioDot $active={wantsTheme === "sim"} />
                      <RadioContent>
                        <RadioTitle>Sim, quero tema</RadioTitle>
                        <RadioText>Detalhes especiais podem gerar ajuste no valor final.</RadioText>
                      </RadioContent>
                    </RadioCard>
                  </RadioGrid>
                </FieldShell>
              </FullWidth>

              {wantsTheme === "sim" ? (
                <>
                  <FieldShell>
                    <Label htmlFor="themeStyle">Estilo do tema</Label>
                    <Input
                      id="themeStyle"
                      placeholder="Ex.: floral delicado, papel fotografico, 3D"
                      {...register("themeStyle")}
                    />
                    <InlineMeta>
                      Use este campo para explicar a linguagem visual do tema.
                    </InlineMeta>
                  </FieldShell>

                  <FieldShell>
                    <Label htmlFor="themeDescription">Descricao do tema</Label>
                    <Textarea
                      id="themeDescription"
                      placeholder="Ex.: nome da aniversariante, paleta de cores e referencias."
                      {...register("themeDescription")}
                    />
                  </FieldShell>
                </>
              ) : null}

              <FullWidth>
                <FieldShell>
                  <Label htmlFor="notes">Observacoes gerais</Label>
                  <Textarea
                    id="notes"
                    rows={3}
                    placeholder="Ex.: menos doce, sem frutas, entrega em condominio, observacoes extras."
                    {...register("notes")}
                  />
                </FieldShell>
              </FullWidth>
            </Grid>
          </Section>

          <Section>
            <SectionHeader>
              <StepIcon aria-hidden>4</StepIcon>
              <SectionHeading>
                <StepLabel>Passo 4</StepLabel>
                <SectionTitle>Entrega</SectionTitle>
                <SectionText>
                  Informe data e horario desejados. O CEP pode ajudar a preencher parte do endereco.
                </SectionText>
              </SectionHeading>
            </SectionHeader>

            <Grid>
              <FieldShell>
                <Label htmlFor="deliveryDate">Data de entrega</Label>
                <Input id="deliveryDate" type="date" {...register("deliveryDate")} />
                <FieldMessage>
                  {errors.deliveryDate ? <ErrorText>{errors.deliveryDate.message}</ErrorText> : null}
                </FieldMessage>
              </FieldShell>

              <FieldShell>
                <Label htmlFor="deliveryTime">Hora de entrega</Label>
                <Input id="deliveryTime" type="time" {...register("deliveryTime")} />
                <FieldMessage>
                  {errors.deliveryTime ? <ErrorText>{errors.deliveryTime.message}</ErrorText> : null}
                </FieldMessage>
              </FieldShell>

              <FullWidth>
                <FieldShell>
                  <Label htmlFor="cep">CEP</Label>
                  <CepRow>
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      inputMode="numeric"
                      maxLength={9}
                      {...register("cep", {
                        onChange: (event) => {
                          setCepError("");
                          setValue("cep", formatCep(event.target.value), {
                            shouldValidate: true,
                          });
                        },
                      })}
                    />
                    <SearchButton
                      type="button"
                      onClick={handleCepLookup}
                      disabled={isLoadingCep}
                    >
                      {isLoadingCep ? "Buscando..." : "Buscar"}
                    </SearchButton>
                  </CepRow>
                  <FieldMessage>
                    {cepError ? <ErrorText>{cepError}</ErrorText> : null}
                  </FieldMessage>
                </FieldShell>
              </FullWidth>

              <FieldShell>
                <Label htmlFor="street">Rua</Label>
                <Input id="street" {...register("street")} />
                <FieldMessage>
                  {errors.street ? <ErrorText>{errors.street.message}</ErrorText> : null}
                </FieldMessage>
              </FieldShell>

              <FieldShell>
                <Label htmlFor="number">Numero</Label>
                <Input id="number" {...register("number")} />
                <FieldMessage>
                  {errors.number ? <ErrorText>{errors.number.message}</ErrorText> : null}
                </FieldMessage>
              </FieldShell>

              <FieldShell>
                <Label htmlFor="district">Bairro</Label>
                <Input id="district" {...register("district")} />
                <FieldMessage>
                  {errors.district ? <ErrorText>{errors.district.message}</ErrorText> : null}
                </FieldMessage>
              </FieldShell>

              <FieldShell>
                <Label htmlFor="city">Cidade</Label>
                <Input id="city" {...register("city")} />
                <FieldMessage>
                  {errors.city ? <ErrorText>{errors.city.message}</ErrorText> : null}
                </FieldMessage>
              </FieldShell>

              <FullWidth>
                <FieldShell>
                  <Label htmlFor="reference">Ponto de referencia</Label>
                  <Input
                    id="reference"
                    placeholder="Ex.: proximo a pracinha, bloco B, casa de esquina."
                    {...register("reference")}
                  />
                </FieldShell>
              </FullWidth>
            </Grid>
          </Section>

          <NotesCard>
            <NotesTitle>Antes de enviar</NotesTitle>
            <NotesList>
              {BUSINESS_NOTES.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </NotesList>
          </NotesCard>
        </MainColumn>

        <Aside>
          <SummaryCard>
            <div>
              <SummaryBadge>Resumo do pedido</SummaryBadge>
              <SummaryTitle>Seu bolo</SummaryTitle>
            </div>

            <SummaryList>
              <SummaryRow>
                <SummaryTerm>Produto</SummaryTerm>
                <SummaryDescription>{selectedProductType?.name ?? "A definir"}</SummaryDescription>
              </SummaryRow>
              <SummaryRow>
                <SummaryTerm>Tamanho</SummaryTerm>
                <SummaryDescription>{selectedSize?.name ?? "A definir"}</SummaryDescription>
              </SummaryRow>
              <SummaryRow>
                <SummaryTerm>Sabor</SummaryTerm>
                <SummaryDescription>{selectedFlavor?.name ?? "A definir"}</SummaryDescription>
              </SummaryRow>
              <SummaryRow>
                <SummaryTerm>Recheio</SummaryTerm>
                <SummaryDescription>{selectedFilling?.name ?? "A definir"}</SummaryDescription>
              </SummaryRow>
              <SummaryRow>
                <SummaryTerm>Cobertura</SummaryTerm>
                <SummaryDescription>{selectedTopping?.name ?? "A definir"}</SummaryDescription>
              </SummaryRow>
              <SummaryRow>
                <SummaryTerm>Massa</SummaryTerm>
                <SummaryDescription>{doughTypeLabel}</SummaryDescription>
              </SummaryRow>
              <SummaryRow>
                <SummaryTerm>Tema</SummaryTerm>
                <SummaryDescription>{themeSummary}</SummaryDescription>
              </SummaryRow>
            </SummaryList>

            <PriceBox>
              <PriceLabel>Valor estimado</PriceLabel>
              <PriceValue>{formatCurrencyBRL(selectedSize?.price)}</PriceValue>
              <PriceText>Valor base. Ajustes finais sao combinados no WhatsApp.</PriceText>
            </PriceBox>

            <PrimaryButton type="submit" disabled={isSubmittingForm}>
              {isSubmittingForm ? "Enviando pedido..." : "Enviar solicitacao"}
            </PrimaryButton>

            <SummaryFootnote>
              Voce sera direcionado(a) ao WhatsApp da confeitaria para a confirmacao final.
            </SummaryFootnote>

            {submitError ? <ErrorText>{submitError}</ErrorText> : null}

            {successMessage ? (
              <FeedbackCard>
                <FeedbackText>{successMessage}</FeedbackText>
                <WhatsAppButton
                  href={buildStoreWhatsAppLink(
                    "Ola! Acabei de enviar meu pedido pelo site da Dany Ruivo e gostaria de acompanhar a confirmacao.",
                  )}
                  label="Chamar a loja no WhatsApp"
                />
              </FeedbackCard>
            ) : null}
          </SummaryCard>
        </Aside>
      </Shell>
    </Form>
  );
}
