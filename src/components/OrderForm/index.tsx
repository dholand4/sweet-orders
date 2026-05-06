"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BUSINESS_NOTES } from "@/constants/business";
import { PriceDisplay } from "@/components/PriceDisplay";
import { ProductTypeSelector } from "@/components/ProductTypeSelector";
import { SizeSelector } from "@/components/SizeSelector";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { buildStoreWhatsAppLink } from "@/utils/format";
import { orderFormSchema } from "@/utils/validations";
import {
  Actions,
  CepRow,
  ErrorText,
  FeedbackCard,
  FeedbackText,
  FieldShell,
  FormDescription,
  FormEyebrow,
  FormHeading,
  FormShell,
  FormTitle,
  FullWidth,
  Grid,
  InlineMeta,
  Input,
  Label,
  NotesCard,
  NotesList,
  NotesTitle,
  PrimaryButton,
  SecondaryButton,
  Section,
  SectionHeader,
  SectionText,
  SectionTitle,
  Select,
  SummaryCard,
  SummaryGrid,
  SummaryItem,
  SummaryLabel,
  SummaryPriceWrap,
  SummaryValue,
  SwitchButton,
  SwitchGroup,
  Textarea,
  TwoThirds,
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
  const selectedFlavor = options.flavors.find(
    (flavor) => flavor.id === watch("flavorId"),
  );
  const selectedFilling = options.fillings.find(
    (filling) => filling.id === watch("fillingId"),
  );
  const selectedTopping = options.toppings.find(
    (topping) => topping.id === watch("toppingId"),
  );

  async function handleCepLookup() {
    const cep = getValues("cep").replace(/\D/g, "");

    if (cep.length !== 8) {
      setSubmitError("Informe um CEP valido com 8 numeros.");
      return;
    }

    setSubmitError("");
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
      setSubmitError(
        error instanceof Error ? error.message : "Falha ao buscar o CEP.",
      );
    } finally {
      setIsLoadingCep(false);
    }
  }

  async function onSubmit(values: OrderFormValues) {
    setSubmitError("");
    setSuccessMessage("");
    setIsSubmittingForm(true);

    const themeValue =
      values.wantsTheme === "sim"
        ? [values.themeStyle, values.themeDescription]
            .filter(Boolean)
            .join(" - ")
        : "";

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          theme: themeValue,
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
    <FormShell>
      <FormHeading>
        <FormEyebrow>Pedido online</FormEyebrow>
        <FormTitle>Monte seu pedido com calma e clareza</FormTitle>
        <FormDescription>
          Preencha as informacoes principais, escolha os sabores e envie sua
          solicitacao. A confirmacao final acontece no WhatsApp com a equipe da
          Dany Ruivo.
        </FormDescription>
      </FormHeading>

      <NotesCard>
        <NotesTitle>Antes de enviar</NotesTitle>
        <NotesList>
          {BUSINESS_NOTES.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </NotesList>
      </NotesCard>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register("productTypeId")} />
        <input type="hidden" {...register("productSizeId")} />
        <input type="hidden" {...register("wantsTheme")} />
        <input type="hidden" {...register("theme")} />
        <Section>
          <SectionHeader>
            <SectionTitle>1. Seus dados</SectionTitle>
            <SectionText>
              Comece com o basico para a equipe identificar seu pedido com rapidez.
            </SectionText>
          </SectionHeader>
          <Grid>
            <FieldShell>
              <Label htmlFor="customerName">Nome</Label>
              <Input id="customerName" placeholder="Seu nome completo" {...register("customerName")} />
              {errors.customerName ? <ErrorText>{errors.customerName.message}</ErrorText> : null}
            </FieldShell>

            <FieldShell>
              <Label htmlFor="whatsapp">Telefone / WhatsApp</Label>
              <Input id="whatsapp" placeholder="(88) 99999-9999" {...register("whatsapp")} />
              {errors.whatsapp ? <ErrorText>{errors.whatsapp.message}</ErrorText> : null}
            </FieldShell>
          </Grid>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>2. Bolo, tamanho e recheio</SectionTitle>
            <SectionText>
              Escolha primeiro o tipo do produto, depois o tamanho, sabor, recheio e a cobertura base.
            </SectionText>
          </SectionHeader>
          <Grid>
            <ProductTypeSelector
              options={options.productTypes}
              value={selectedProductTypeId}
              onChange={(value) => {
                setValue("productTypeId", value, { shouldValidate: true });
                setValue("productSizeId", "", { shouldValidate: true });
              }}
              error={errors.productTypeId?.message}
            />

            <div>
              <SizeSelector
                options={filteredSizes}
                value={selectedProductSizeId}
                onChange={(value) =>
                  setValue("productSizeId", value, { shouldValidate: true })
                }
                error={errors.productSizeId?.message}
              />
              {!selectedProductTypeId ? (
                <InlineMeta>Escolha primeiro o tipo para liberar os tamanhos disponiveis.</InlineMeta>
              ) : null}
            </div>

            <FieldShell>
              <Label htmlFor="flavorId">Sabor</Label>
              <Select id="flavorId" {...register("flavorId")}>
                <option value="">Selecione</option>
                {options.flavors.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </Select>
              {errors.flavorId ? <ErrorText>{errors.flavorId.message}</ErrorText> : null}
            </FieldShell>

            <FieldShell>
              <Label htmlFor="fillingId">Recheio</Label>
              <Select id="fillingId" {...register("fillingId")}>
                <option value="">Selecione</option>
                {options.fillings.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </Select>
              {errors.fillingId ? <ErrorText>{errors.fillingId.message}</ErrorText> : null}
            </FieldShell>

            <FieldShell>
              <Label htmlFor="toppingId">Cobertura</Label>
              <Select id="toppingId" {...register("toppingId")}>
                <option value="">Selecione</option>
                {options.toppings.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </Select>
              {errors.toppingId ? <ErrorText>{errors.toppingId.message}</ErrorText> : null}
            </FieldShell>
          </Grid>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>3. Tema e acabamento</SectionTitle>
            <SectionText>
              Se desejar um tema personalizado, o estilo dele fica definido aqui, separado da cobertura do bolo.
            </SectionText>
          </SectionHeader>
          <Grid>
            <TwoThirds>
              <FieldShell>
                <Label>Quer incluir tema?</Label>
                <SwitchGroup>
                  <SwitchButton
                    type="button"
                    $active={wantsTheme === "nao"}
                    onClick={() => {
                      setValue("wantsTheme", "nao");
                      setValue("themeStyle", "");
                      setValue("themeDescription", "");
                    }}
                  >
                    Nao, quero algo mais classico
                  </SwitchButton>
                  <SwitchButton
                    type="button"
                    $active={wantsTheme === "sim"}
                    onClick={() => setValue("wantsTheme", "sim")}
                  >
                    Sim, quero tema
                  </SwitchButton>
                </SwitchGroup>
              </FieldShell>
            </TwoThirds>

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
                    Use este campo para explicar a linguagem visual do tema, nao a cobertura.
                  </InlineMeta>
                </FieldShell>

                <TwoThirds>
                  <FieldShell>
                    <Label htmlFor="themeDescription">Descricao do que voce imagina</Label>
                    <Textarea
                      id="themeDescription"
                      placeholder="Ex.: tema floral com tons rosados, nome da aniversariante e detalhes dourados."
                      {...register("themeDescription")}
                    />
                  </FieldShell>
                </TwoThirds>
              </>
            ) : (
              <FullWidth>
                <InlineMeta>
                  Sem problema. O pedido pode seguir sem tema personalizado.
                </InlineMeta>
              </FullWidth>
            )}

            <FullWidth>
              <FieldShell>
                <Label htmlFor="notes">Observacoes gerais</Label>
                <Textarea
                  id="notes"
                  placeholder="Ex.: menos doce, sem frutas, entrega em condominio, observacoes extras."
                  {...register("notes")}
                />
              </FieldShell>
            </FullWidth>
          </Grid>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>4. Entrega</SectionTitle>
            <SectionText>
              Informe data e horario desejados. Se quiser, o CEP pode ajudar a preencher parte do endereco.
            </SectionText>
          </SectionHeader>
          <Grid>
            <FieldShell>
              <Label htmlFor="deliveryDate">Data de entrega</Label>
              <Input id="deliveryDate" type="date" {...register("deliveryDate")} />
              {errors.deliveryDate ? <ErrorText>{errors.deliveryDate.message}</ErrorText> : null}
            </FieldShell>

            <FieldShell>
              <Label htmlFor="deliveryTime">Hora de entrega</Label>
              <Input id="deliveryTime" type="time" {...register("deliveryTime")} />
              {errors.deliveryTime ? <ErrorText>{errors.deliveryTime.message}</ErrorText> : null}
            </FieldShell>

            <FullWidth>
              <CepRow>
                <FieldShell>
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" placeholder="00000-000" {...register("cep")} />
                </FieldShell>
                <SecondaryButton
                  type="button"
                  onClick={handleCepLookup}
                  disabled={isLoadingCep}
                >
                  {isLoadingCep ? "Buscando CEP..." : "Buscar endereco"}
                </SecondaryButton>
              </CepRow>
              <InlineMeta>
                Se preferir, voce pode ignorar o CEP e preencher o endereco manualmente.
              </InlineMeta>
            </FullWidth>

            <FieldShell>
              <Label htmlFor="street">Rua</Label>
              <Input id="street" {...register("street")} />
              {errors.street ? <ErrorText>{errors.street.message}</ErrorText> : null}
            </FieldShell>

            <FieldShell>
              <Label htmlFor="number">Numero</Label>
              <Input id="number" {...register("number")} />
              {errors.number ? <ErrorText>{errors.number.message}</ErrorText> : null}
            </FieldShell>

            <FieldShell>
              <Label htmlFor="district">Bairro</Label>
              <Input id="district" {...register("district")} />
              {errors.district ? <ErrorText>{errors.district.message}</ErrorText> : null}
            </FieldShell>

            <FieldShell>
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" {...register("city")} />
              {errors.city ? <ErrorText>{errors.city.message}</ErrorText> : null}
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

        <Actions>
          <SummaryCard>
            <SummaryGrid>
              <SummaryItem>
                <SummaryLabel>Produto</SummaryLabel>
                <SummaryValue>{selectedProductType?.name ?? "A definir"}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Tamanho</SummaryLabel>
                <SummaryValue>{selectedSize?.name ?? "A definir"}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Sabor</SummaryLabel>
                <SummaryValue>{selectedFlavor?.name ?? "A definir"}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Recheio</SummaryLabel>
                <SummaryValue>{selectedFilling?.name ?? "A definir"}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <SummaryLabel>Cobertura</SummaryLabel>
                <SummaryValue>{selectedTopping?.name ?? "A definir"}</SummaryValue>
              </SummaryItem>
              <SummaryPriceWrap>
                <SummaryLabel>Valor base</SummaryLabel>
                <PriceDisplay value={selectedSize?.price} caption="Preco estimado" />
              </SummaryPriceWrap>
            </SummaryGrid>
          </SummaryCard>

          <PrimaryButton type="submit" disabled={isSubmittingForm}>
            {isSubmittingForm ? "Enviando pedido..." : "Enviar solicitacao"}
          </PrimaryButton>

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
        </Actions>
      </form>
    </FormShell>
  );
}
