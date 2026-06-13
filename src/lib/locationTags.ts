export interface LocationTag {
  id: string;
  name: string;
  color: string;
  children?: LocationTag[];
}

const LOCATION_TAG_COLOR = "#F5B914";

export const LOCATION_TAGS: LocationTag[] = [
  {
    id: "edificio-2",
    name: "Edificio 2",
    color: LOCATION_TAG_COLOR,
    children: [
      { id: "edificio-2-piso-1", name: "Piso 1", color: LOCATION_TAG_COLOR },
      { id: "edificio-2-piso-2", name: "Piso 2", color: LOCATION_TAG_COLOR },
    ],
  },
  { id: "apartamento-112", name: "Apartamento 112", color: LOCATION_TAG_COLOR },
  { id: "fachada", name: "Fachada", color: LOCATION_TAG_COLOR },
  {
    id: "zona-comun",
    name: "Zona Común",
    color: LOCATION_TAG_COLOR,
    children: [{ id: "zona-comun-parqueadero", name: "Parqueadero", color: LOCATION_TAG_COLOR }],
  },
];

export function flattenLocationTags(nodes: LocationTag[] = LOCATION_TAGS): LocationTag[] {
  return nodes.flatMap((node) => [node, ...flattenLocationTags(node.children ?? [])]);
}
