import { Static, Type } from '@sinclair/typebox'
import { LocalesEnum } from '../common'
import { ApId } from '../common/id-generator'
import { FederatedAuthnProviderConfig } from '../federated-authn'
import { FilteredPieceBehavior } from './platform.model'
import { SMTPInformation } from './platform.model'

export const UpdatePlatformRequestBody = Type.Object({
    name: Type.Optional(Type.String()),
    primaryColor: Type.Optional(Type.String()),
    logoIconUrl: Type.Optional(Type.String()),
    fullLogoUrl: Type.Optional(Type.String()),
    favIconUrl: Type.Optional(Type.String()),
    filteredPieceNames: Type.Optional(Type.Array(Type.String())),
    filteredPieceBehavior: Type.Optional(Type.Enum(FilteredPieceBehavior)),
    smtp: Type.Optional(SMTPInformation),
    federatedAuthProviders: Type.Optional(FederatedAuthnProviderConfig),
    cloudAuthEnabled: Type.Optional(Type.Boolean()),
    emailAuthEnabled: Type.Optional(Type.Boolean()),
    allowedAuthDomains: Type.Optional(Type.Array(Type.String())),
    enforceAllowedAuthDomains: Type.Optional(Type.Boolean()),
    defaultLocale: Type.Optional(Type.Enum(LocalesEnum)),
})

export type UpdatePlatformRequestBody = Static<typeof UpdatePlatformRequestBody>

export const AdminAddPlatformRequestBody = Type.Object({
    userId: ApId,
    projectId: ApId,
    name: Type.String(),
    primaryColor: Type.Optional(Type.String()),
    logoIconUrl: Type.Optional(Type.String()),
    fullLogoUrl: Type.Optional(Type.String()),
    favIconUrl: Type.Optional(Type.String()),
})

export type AdminAddPlatformRequestBody = Static<typeof AdminAddPlatformRequestBody>
