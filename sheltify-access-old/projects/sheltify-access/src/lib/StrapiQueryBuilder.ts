export class StrapiQueryBuilder<T> {
  private url;
  private params: string[] = [];

  constructor(collectionName: string = "") {
    this.url = collectionName;
  }

  populateIndex = 0;
  populate(fieldName: keyof T & string, deep = false): StrapiQueryBuilder<T> {
    if(!deep) {
      this.params.push(`populate[${this.populateIndex}]=${fieldName}`);
      this.populateIndex++;
    } else {

      //TODO populate index
      this.params.push(`populate[${fieldName}][populate]=*`);
    }
    return this;
  }

  filter(field: keyof T & string, operator: StrapiFilterOperator, value = ""): StrapiQueryBuilder<T> {
    this.params.push(`filters[$${field}][$${operator}]=${value}]`);
    return this;
  }

  orFilter(filters: [keyof T & string, StrapiFilterOperator, string][]): StrapiQueryBuilder<T> {
    for (let i = 0; i < filters.length; i++){
      const filter = filters[i];
      this.params.push(`filters[$or][${i}][${filter[0]}][$${filter[1]}]=${filter[2]}`);
    }
    return this;
  }

  pagination(pageSize: number, page: number = 1): StrapiQueryBuilder<T> {
    this.params.push(`pagination[page]=${page}`, `pagination[pageSize]=${pageSize}`);
    return this;
  }

  andFilter(filters: [string, StrapiFilterOperator, string][]): StrapiQueryBuilder<T> {
    for (let i = 0; i < filters.length; i++){
      const filter = filters[i];
      this.params.push(`filters[$and][${i}][${filter[0]}][$${filter[1]}]=${filter[2]}`);
    }
    return this;
  }

  deepFilter(field: keyof T & string, deepField: string, operator: StrapiFilterOperator, value = ""): StrapiQueryBuilder<T> {
    this.params.push(`filters[${field}][${deepField}][$${operator}]=${value}]`);
    return this;
  }

  sort(...sortFields: [keyof T & string, "asc" | "desc"][]): StrapiQueryBuilder<T> {
    for (let i = 0; i < sortFields.length; i++){
      const sorter = sortFields[i];
      this.params.push(`sort[${i}]=${sorter[0]}:${sorter[1]}`);
    }
    return this;
  }

  buildUrl() {
    return this.url + "?" + this.params.join("&");
  }

  buildParams() {
    return this.params.join("&");
  }
}

type StrapiFilterOperator = "$eq" |
"eqi" |
"ne" |
"nei" |
"lt" |
"lte" |
"gt" |
"gte" |
"in" |
"notIn" |
"contains" |
"notContains" |
"containsi" |
"notContainsi" |
"null" |
"notNull" |
"between" |
"startsWith" |
"startsWithi" |
"endsWith" |
"endsWithi" |
"or" |
"and" |
"not";
