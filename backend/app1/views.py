from django.shortcuts import render

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
# import hnswlib
# import voyageai as vo
import numpy as np


# @csrf_exempt
# def search(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         query = data['query']
#         new_embedding = vo.embed(query, model="voyage-2", input_type="query")
#         labels, distances = p.knn_query(new_embedding.embeddings, k=1)

#         # Assume name_dict and chunks are accessible here
#         result = {
#             'file_name': name_dict['file_name'],
#             'paragraph': list(chunks.keys())[labels[0][0]],
#             'page': list(chunks.values())[labels[0][0]][1]
#         }
#         return JsonResponse({'results': [result]})
#     else:
#         return JsonResponse({'error': 'Invalid HTTP method'}, status=405)
